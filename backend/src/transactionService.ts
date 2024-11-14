import { getBankAccountByUID, adjustBalance } from "./bankAccountDAO"
import { getTransactionHistory, logTransaction } from "./transactionsDAO"
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "../../constants/firebaseConfig"

/**Function is used to transfer money from one account to another.
 *
 * @param senderUID A string of the id of the sender.
 * @param receiverUID A string of the id of the receiver.
 * @param amount A number of the amount of money to be transferred.
 * @param description A string of the description of the transaction.
 */
export async function transferMoney(senderUID: string, receiverUID: string, amount: number, description: string, type: string) {
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
        throw new Error(
          "Cumulative spending exceeds spending limit for the specified period with limit " +
            senderAccount.spending_limit +
            " and time " +
            senderAccount.spending_time_limit
        )
      }
    }

    await adjustBalance(senderAccount.id, -amount)
    await adjustBalance(receiverAccount.id, amount)

    await logTransaction(senderUID, receiverUID, amount, description, type)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to transfer money")
  }
}

/**Function is used to request money from another user.
 *
 * @param requesterUID A string of the id of the requester.
 * @param recipientUID A string of the id of the recipient.
 * @param amount A number of the amount of money to be requested.
 * @param description A string of the description of the transaction.
 * @returns the id of the request created.
 */
export async function requestMoney(requesterUID: string, recipientUID: string, amount: number, description: string) {
  try {
    const requestDocRef = await addDoc(collection(db, "moneyRequests"), {
      amount: amount,
      description: description,
      requestDate: Timestamp.now(),
      requesterId: `/users/${requesterUID}`,
      senderId: `/users/${recipientUID}`,
      status: "pending",
    })

    return requestDocRef.id
  } catch (error) {
    console.error("Failed to create money request:", error)
    throw new Error("Failed to request money")
  }
}

/**Function is used to accept a money request.
 * It will update the status of the request to 'accepted' and transfer the money
 * from the sender to the receiver.
 *
 * @param requestId A string of the id of the request. Should be gettable.
 * @param senderUID A string of the id of the sender.
 * @param receiverUID A string of the id of the receiver.
 * @param amount A number of the amount of money to be accepted.
 * @param description A string of the description of the transaction.
 */
export async function acceptMoneyRequest(
  requestId: string,
  senderUID: string,
  receiverUID: string,
  amount: number,
  description: string
) {
  try {
    const senderAccount = await getBankAccountByUID(senderUID)
    const receiverAccount = await getBankAccountByUID(receiverUID)

    if (senderAccount.balance < amount) {
      throw new Error("Insufficient funds")
    }

    const requestDocRef = doc(db, "moneyRequests", requestId)
    await updateDoc(requestDocRef, {
      status: "accepted",
    })

    await adjustBalance(senderAccount.id, -amount)
    await adjustBalance(receiverAccount.id, amount)

    await logTransaction(senderAccount.id, receiverAccount.id, amount, description, "transfer")
  } catch (error) {
    throw new Error("Failed to accept money request")
  }
}

/**Funtion is used to reject a money request.
 *
 * @param requestId A string of the id of the request
 */
export async function rejectMoneyRequest(requestId: string) {
  try {
    const requestDocRef = doc(db, "moneyRequests", requestId)
    await updateDoc(requestDocRef, {
      status: "rejected",
    })
  } catch (error) {
    console.error("Failed to reject money request:", error)
    throw new Error("Failed to reject money request")
  }
}
