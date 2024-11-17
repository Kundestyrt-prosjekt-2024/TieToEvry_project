import { db } from "@/constants/firebaseConfig"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { MoneyRequest } from "../types/moneyRequest"
import { getBankAccountByUID } from "./bankAccountDAO"
import { transferMoney } from "./transactionsDAO"

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
