import { db } from "@/constants/firebaseConfig"
import { setDoc, doc, collection, getDoc, query, where, getDocs } from "firebase/firestore"
import { MoneyRequest } from "../types/transaction";
import { logTransaction } from "./transactionsDAO";
import { transferMoney } from "./transactionService";
import { getBankAccountByUID } from "./bankAccountDAO";

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

export async function fetchPaymentHistory(currentUserId: string, historyUserId: string) : Promise<any[]> {
    try {
        const payments: any[] = []
        const currentAccount = await getBankAccountByUID(currentUserId)
        const historyAccount = await getBankAccountByUID(historyUserId)

        const transactionRef = collection(db, "transactions");
        const senderQuery = query(transactionRef, where("sender", "==", currentAccount), where("receiver", "==", historyAccount), where("type", "==", "payment"));
        const receiverQuery = query(transactionRef, where("receiver", "==", currentAccount), where("sender", "==", historyAccount), where("type", "==", "payment"));

        const [senderSnapshot, receiverSnapshot] = await Promise.all([getDocs(senderQuery), getDocs(receiverQuery)]);
        senderSnapshot.forEach((doc) => {
            payments.push(doc.data());
        });
        receiverSnapshot.forEach((doc) => {
            payments.push(doc.data());
        });

        const moneyRequestsRef = collection(db, "moneyRequests");
        const requesterQuery = query(moneyRequestsRef, where("sender", "==", currentUserId), where("receiver", "==", historyUserId));
        const requestedQuery = query(moneyRequestsRef, where("receiver", "==", currentUserId), where("sender", "==", historyUserId));

        const [requesterSnapshot, requestedSnapshot] = await Promise.all([getDocs(requesterQuery), getDocs(requestedQuery)]);
        requesterSnapshot.forEach((doc) => {
            payments.push(doc.data());
        });
        requestedSnapshot.forEach((doc) => {
            payments.push(doc.data());
        });

        return payments;
    }
    catch (error: any) {
        throw new Error(error.message)
    }
}
