import { db } from "@/constants/firebaseConfig"
import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore"
import { MoneyRequest } from "../types/moneyRequest"
import { getBankAccountByUID } from "./bankAccountDAO"

export async function getMoneyRequests(accountID: string) {
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
