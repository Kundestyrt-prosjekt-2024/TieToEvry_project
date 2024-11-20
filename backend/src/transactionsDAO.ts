import { db } from "../../constants/firebaseConfig"
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp, or, and } from "firebase/firestore"
import { Transaction } from "../types/transaction"
import { adjustBalance, getBankAccountByUID } from "./bankAccountDAO"

/**
 * Transfers money from one user to another with specified validation rules.
 *
 * @param {string} senderUID - The UID of the sender's account.
 * @param {string} receiverUID - The UID of the receiver's account.
 * @param {number} amount - The amount of money to transfer.
 * @param {string} description - A description for the transaction.
 * @throws {Error} - If the transfer fails due to insufficient funds, invalid limits, or other reasons.
 */
export async function transferMoney(senderUID: string, receiverUID: string, amount: number, description: string) {
  try {
    const senderAccount = await getBankAccountByUID(senderUID)
    const receiverAccount = await getBankAccountByUID(receiverUID)

    if (senderAccount.balance < amount) {
      throw new Error("Insufficient funds")
    }

    if (senderAccount.UID === receiverAccount.UID) {
      throw new Error("Cannot transfer money to the same account")
    }

    if (senderAccount.currency !== receiverAccount.currency) {
      throw new Error("Cannot transfer money between accounts with different currencies")
    }

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0")
    }

    if (senderAccount.spending_time_limit) {
      // Get the current date for comparison
      const now = new Date()
      let fromDate: Date

      // Determine the start date for the spending limit period
      switch (senderAccount.spending_time_limit) {
        case "daily":
          fromDate = new Date(now)
          fromDate.setHours(0, 0, 0, 0) // Start of the day
          break
        case "weekly":
          fromDate = new Date(now)
          fromDate.setDate(now.getDate() - now.getDay()) // Start of the current week (Sunday)
          fromDate.setHours(0, 0, 0, 0)
          break
        case "monthly":
          fromDate = new Date(now.getFullYear(), now.getMonth(), 1) // Start of the month
          break
        default:
          throw new Error("Invalid spending time limit")
      }

      const transactions = await getTransactionHistory(senderUID, fromDate, now)
      const totalSpent = transactions
        .filter((transaction) => transaction.account_id_from === senderUID)
        .reduce((sum, transaction) => sum + transaction.amount, 0)

      // Check if the cumulative spending limit has been exceeded
      if (totalSpent + amount > senderAccount.spending_limit) {
        throw new Error("Cumulative spending exceeds spending limit for the specified period")
      }
    }

    if (senderAccount.spending_limit_per_purchase !== Number.MAX_SAFE_INTEGER) {
      if (amount > senderAccount.spending_limit_per_purchase) {
        throw new Error("Amount exceeds spending limit per purchase")
      }
    }

    await adjustBalance(senderAccount.id, -amount)
    await adjustBalance(receiverAccount.id, amount)

    const newTransaction: Transaction = {
      account_id_from: senderAccount.id,
      account_id_to: receiverAccount.id,
      description: description,
      amount: amount,
      type: "transfer",
      date: Timestamp.now(),
    }

    await addDoc(collection(db, "transactions"), newTransaction)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    throw new Error(errorMessage)
  }
}

/**
 * Retrieves all transactions made from or to a specific account, optionally filtered by date range.
 *
 * @param {string} accountId - The ID of the account to retrieve transactions for.
 * @param {Date} [fromDate] - Optional start date for filtering transactions.
 * @param {Date} [toDate] - Optional end date for filtering transactions.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions.
 */
export async function getTransactionHistory(accountId: string, fromDate?: Date, toDate?: Date) {
  const transactionsRef = collection(db, "transactions")

  let q = query(
    transactionsRef,
    or(
      where("account_id_from", "==", accountId), // Outgoing transactions
      where("account_id_to", "==", accountId) // Incoming transactions
    )
  )

  if (fromDate) {
    q = query(q, where("date", ">=", fromDate))
  }

  if (toDate) {
    q = query(q, where("date", "<=", toDate))
  }

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data()) as Transaction[]
}

/**
 * Retrieves all transactions made between two specific accounts.
 *
 * @param {string} accountId1 - The ID of the first account.
 * @param {string} accountId2 - The ID of the second account.
 * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions between the two accounts.
 */
export async function getTransactionHistoryBetweenAccounts(accountId1: string, accountId2: string) {
  const transactionsRef = collection(db, "transactions")

  // Query for transactions between the two accounts
  const q = query(
    transactionsRef,
    or(
      // Transactions where accountId1 sent to accountId2
      and(where("account_id_from", "==", accountId1), where("account_id_to", "==", accountId2)),
      // Transactions where accountId2 sent to accountId1
      and(where("account_id_from", "==", accountId2), where("account_id_to", "==", accountId1))
    )
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data()) as Transaction[]
}

/**
 * Fetches transaction statistics for a specific account within a given month.
 *
 * @param {string} accountId - The ID of the account to fetch statistics for.
 * @param {number} month - The month (0-11) to retrieve statistics for.
 * @returns {Promise<{to: Transaction[], from: Transaction[]}>} - A promise that resolves to an object containing incoming and outgoing transactions for the month.
 */
export async function fetchMonthStatsFS(accountId: string, month: number) {
  const transactionsRef = collection(db, "transactions")
  const currYear = new Date().getFullYear()

  const q1 = query(
    transactionsRef,
    where("account_id_to", "==", accountId),
    where("date", ">=", new Date(currYear, month, 1)),
    where("date", "<", new Date(currYear, month + 1, 1))
  )

  const q2 = query(
    transactionsRef,
    where("account_id_from", "==", accountId),
    where("date", ">=", new Date(currYear, month, 1)),
    where("date", "<", new Date(currYear, month + 1, 1))
  )

  const [toSnapshot, fromSnapshot] = await Promise.all([getDocs(q1), getDocs(q2)])
  const toDocs = toSnapshot.docs.map((doc) => doc.data())
  const fromDocs = fromSnapshot.docs.map((doc) => doc.data())

  return { to: toDocs, from: fromDocs }
}
