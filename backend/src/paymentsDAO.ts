import { db } from "@/constants/firebaseConfig"
import { setDoc, doc, collection, getDoc } from "firebase/firestore"
import { MoneyRequest } from "../types/transaction";
import { logTransaction } from "./transactionsDAO";
import { transferMoney } from "./transactionService";

export async function requestMoneyFS(receiver: string, sender: string, amount: number, message: string) {
    try {
        const transactionRef = collection(db, "moneyRequests");
        const request = {
            receiver,
            sender,
            amount,
            message,
            requestedAt: new Date(),
            status: "pending"
        }
        
        await setDoc(doc(transactionRef), request);
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function acceptMoneyRequestFS(requestId: string) {
    try {
        const requestDocRef = doc(db, "moneyRequests", requestId);
        const request = await getDoc(requestDocRef);
        const requestDetails = request.data() as MoneyRequest;
        transferMoney(requestDetails.receiver, requestDetails.sender, requestDetails.amount, "Payment: " + requestDetails.message, "payment").then(() => {
            setDoc(requestDocRef, { status: "accepted" });
        });
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function rejectMoneyRequestFS(requestId: string) {
    try {
        const requestDocRef = doc(db, "moneyRequests", requestId);
        await setDoc(requestDocRef, { status: "rejected" });
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function cancelMoneyRequestFS(requestId: string) {
    try {
        const requestDocRef = doc(db, "moneyRequests", requestId);
        await setDoc(requestDocRef, { status: "cancelled" });
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function sendMoneyFS(sender: string, receiver: string, amount: number, message: string) {
    try {
        transferMoney(sender, receiver, amount, "Payment: " + message, "payment")
    } catch (error: any) {
        throw new Error(error.message)
    }
}