import { db } from "../../constants/firebaseConfig"
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp, or } from "firebase/firestore"
import { Transaction } from "../types/transaction"

/**Function is used to add a transaction to the database.
 *
 * @param fromAccountId A string of the id of the sender.
 * @param toAccountId A string of the id of the receiver.
 * @param amount A number of the amount of money to be transferred.
 * @param description A string of the description of the transaction.
 * @param transactionType A string of the type of the transaction. Has to be 'transfer' or 'chore'.
 */
export async function logTransaction(fromAccountId: string, toAccountId: string, amount: number, description: string) {
  try {
    const newTransaction: Transaction = {
      account_id_from: fromAccountId,
      account_id_to: toAccountId,
      description: description,
      amount: amount,
      type: "transfer",
      date: Timestamp.now(),
    }

    await addDoc(collection(db, "transactions"), newTransaction)
  } catch (error) {
    throw new Error("Failed to log transaction and update activity dates")
  }
}

/**Function is used to get all transactions made from an account.
 *
 * @param accountId A string of the id of the account.
 * @param fromDate Optional Date object representing the start date of the transaction filter.
 * @param toDate Optional Date object representing the end date of the transaction filter.
 * @returns an array of transactions made from the account.
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

/**Function is used to get all money requests made by a user.
 *
 * @param userId A string of the id of the user.
 * @returns an array of money requests made by the user.
 */
export async function getMoneyRequests(userId: string) {
  const moneyRequestsRef = collection(db, "moneyRequests")

  const requesterQuery = query(moneyRequestsRef, where("requesterId", "==", userId))
  const requesterSnapshot = await getDocs(requesterQuery)
  const requesterResults = requesterSnapshot.docs.map((doc) => doc.data())

  const senderQuery = query(moneyRequestsRef, where("senderId", "==", userId))
  const senderSnapshot = await getDocs(senderQuery)
  const senderResults = senderSnapshot.docs.map((doc) => doc.data())

  const combinedResults = [...requesterResults, ...senderResults]

  return combinedResults
}
