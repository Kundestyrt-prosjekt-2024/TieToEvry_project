import { db } from "@/constants/firebaseConfig"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { Allowance, MoneyRequest } from "../types/moneyRequest"
import { getBankAccountByUID } from "./bankAccountDAO"
import { transferMoney } from "./transactionsDAO"

/**
 * Retrieves money requests associated with a specific account ID.
 *
 * @param {string} accountID - The ID of the account for which to fetch money requests.
 * @param {(updatedData: MoneyRequest[]) => void} [updateMoneyRequests] - Optional callback for real-time updates.
 * @returns {Promise<MoneyRequest[]>} - A promise that resolves to an array of money requests.
 * @throws {Error} - If fetching money requests fails.
 */
export async function getMoneyRequests(
  accountID: string,
  updateMoneyRequests?: (updatedData: MoneyRequest[]) => void
): Promise<MoneyRequest[]> {
  try {
    const moneyRequestsCollection = collection(db, "moneyRequests")

    const receiverQuery = query(moneyRequestsCollection, where("receiver", "==", accountID))
    const senderQuery = query(moneyRequestsCollection, where("sender", "==", accountID))

    const [receiverSnapshot, senderSnapshot] = await Promise.all([getDocs(receiverQuery), getDocs(senderQuery)])

    const moneyRequests: MoneyRequest[] = []

    receiverSnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        moneyRequests.push({
          id: docSnap.id,
          ...(docSnap.data() as MoneyRequest),
        })
      }
    })

    senderSnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        moneyRequests.push({
          id: docSnap.id,
          ...(docSnap.data() as MoneyRequest),
        })
      }
    })

    if (moneyRequests.length === 0) {
      throw new Error("No money requests found for this user")
    }

    if (updateMoneyRequests) {
      const unsubscribeReceiver = onSnapshot(receiverQuery, (snapshot) => {
        const updatedRequests: MoneyRequest[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as MoneyRequest),
        }))
        updateMoneyRequests([...moneyRequests.filter((mr) => mr.receiver !== accountID), ...updatedRequests])
      })

      const unsubscribeSender = onSnapshot(senderQuery, (snapshot) => {
        const updatedRequests: MoneyRequest[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as MoneyRequest),
        }))
        updateMoneyRequests([...moneyRequests.filter((mr) => mr.sender !== accountID), ...updatedRequests])
      })
    }

    return moneyRequests
  } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * Sends a money request from one user to another.
 *
 * @param {string} senderUID - The UID of the sender.
 * @param {string} receiverUID - The UID of the receiver.
 * @param {string} message - A message associated with the money request.
 * @param {number} amount - The amount to request.
 * @throws {Error} - If the money request fails to send.
 */
export async function sendMoneyRequest(senderUID: string, receiverUID: string, message: string, amount: number) {
  try {
    const senderAccount = await getBankAccountByUID(senderUID)
    const receiverAccount = await getBankAccountByUID(receiverUID)

    const moneyRequest: MoneyRequest = {
      receiver: receiverAccount.id,
      sender: senderAccount.id,
      message: message,
      amount: amount,
      date: Timestamp.now(),
      status: "pending",
    }

    await addDoc(collection(db, "moneyRequests"), moneyRequest)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to send money request")
  }
}

/**
 * Accepts a money request, transferring funds and updating the request's status.
 *
 * @param {string} id - The ID of the money request to accept.
 * @throws {Error} - If accepting the money request fails.
 */
export async function acceptMoneyRequest(id: string) {
  try {
    const requestDocRef = doc(db, "moneyRequests", id)
    const requestDoc = await getDoc(requestDocRef)

    if (!requestDoc.exists()) {
      throw new Error(`Money request with id ${id} not found`)
    }

    // const accountDoc = await getDoc(doc(db, "bankAccounts", id))

    // Extract data from the document
    const { sender, receiver, amount, message } = requestDoc.data()

    const senderBankaccountDoc = await getDoc(doc(db, "bankAccounts", sender))
    const senderUID = senderBankaccountDoc.data()?.UID

    const receiverBankaccountDoc = await getDoc(doc(db, "bankAccounts", receiver))
    const receiverUID = receiverBankaccountDoc.data()?.UID

    // Trigger the transferMoney function
    await transferMoney(receiverUID, senderUID, amount, message)

    // Update the "status" field to "accepted"
    await updateDoc(requestDocRef, {
      status: "accepted",
    })
  } catch (error) {
    console.log(error)
    throw new Error("Failed to accept money request")
  }
}

/**
 * Rejects a money request by updating its status to "rejected."
 *
 * @param {string} id - The ID of the money request to reject.
 * @throws {Error} - If rejecting the money request fails.
 */
export async function rejectMoneyRequest(id: string) {
  try {
    // Reference the specific document in the "moneyRequests" collection
    const requestDocRef = doc(db, "moneyRequests", id)

    // Update the "status" field to "rejected"
    await updateDoc(requestDocRef, {
      status: "rejected",
    })
  } catch (error) {
    console.log(error)
    throw new Error("Failed to reject money request")
  }
}

/**
 * Deletes a money request by its ID.
 *
 * @param {string} id - The ID of the money request to delete.
 * @throws {Error} - If deleting the money request fails.
 */
export async function deleteMoneyRequest(id: string) {
  try {
    // Reference the specific document in the "moneyRequests" collection
    const requestDocRef = doc(db, "moneyRequests", id)

    // Delete the document
    await deleteDoc(requestDocRef)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to delete money request")
  }
}

/**
 * Retrieves the allowance information for a specific user.
 *
 * @param {string} uid - The UID of the user for whom to fetch the allowance.
 * @returns {Promise<Allowance>} - A promise that resolves to the allowance information.
 * @throws {Error} - If fetching the allowance fails.
 */
export async function getAllowance(uid: string): Promise<Allowance> {
  try {
    const allowanceRef = doc(db, "allowances", uid)
    const allowanceDoc = await getDoc(allowanceRef)
    return allowanceDoc.data() as Allowance
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get allowance")
  }
}

/**
 * Sets the allowance for a specific user.
 *
 * @param {string} uid - The UID of the user for whom to set the allowance.
 * @param {number} recurrence - The recurrence interval for the allowance (e.g., days between payments).
 * @param {number} day - The specific day for allowance payments (if applicable).
 * @param {number} amount - The allowance amount.
 * @param {string} [message] - An optional message for the allowance.
 * @throws {Error} - If setting the allowance fails.
 */
export async function setAllowance(uid: string, recurrence: number, day: number, amount: number, message?: string) {
  try {
    const allowanceRef = doc(db, "allowances", uid)
    const allowance: Allowance = {
      recurrence: recurrence,
      day: day,
      amount: amount,
      message: message ?? "",
      date: Timestamp.now(),
    }
    await setDoc(allowanceRef, allowance)
  } catch (error) {
    console.log(error)
    throw new Error("Failed to set allowance")
  }
}
