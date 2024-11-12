import { db } from "../../constants/firebaseConfig"
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp, or, and } from "firebase/firestore"
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
 * @returns an array of transactions made from the account.
 */
export async function getTransactionHistory(accountId: string) {
  const transactionsRef = collection(db, "transactions")

  const q = query(
    transactionsRef,
    or(
      where("account_id_from", "==", accountId), // Outgoing transactions
      where("account_id_to", "==", accountId) // Incoming transactions
    )
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data())
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

export async function fetchMonthStatsFS(accountId: string, month: number) {
  const transactionsRef = collection(db, "transactions")
  const currYear = new Date().getFullYear()

  const q1 = query(
    transactionsRef,
    where("account_id_to", "==", accountId),
    where("transactions_date", ">=", new Date(currYear, month, 1)),
    where("transactions_date", "<", new Date(currYear, month + 1, 1))
  );

  const q2 = query(
    transactionsRef,
    where("account_id_from", "==", accountId),
    where("transactions_date", ">=", new Date(currYear, month, 1)),
    where("transactions_date", "<", new Date(currYear, month + 1, 1))
  );

  const [toSnapshot, fromSnapshot] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const toDocs = toSnapshot.docs.map((doc) => doc.data());
  const fromDocs = fromSnapshot.docs.map((doc) => doc.data());

  return {"to": toDocs, "from": fromDocs}
}

