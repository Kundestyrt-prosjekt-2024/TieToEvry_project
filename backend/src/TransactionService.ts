import { getBankAccountByUID, updateBalance } from './BankAccountDAO';
import { logTransaction } from './TransactionDAO';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../constants/firebaseConfig';


//Sends money from one user to another.

export async function sendMoney(senderUID: string, receiverUID: string, amount: number, description: string) {
    try {
        // Retrieve bank accounts for sender and receiver
        const senderAccount = await getBankAccountByUID(senderUID);
        const receiverAccount = await getBankAccountByUID(receiverUID);

        // Check if the sender has sufficient balance
        if (senderAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Update balances
        await updateBalance(senderAccount.id, senderAccount.balance - amount);
        await updateBalance(receiverAccount.id, receiverAccount.balance + amount);

        // Log the transaction
        await logTransaction(
            senderAccount.id, // fromAccountId
            receiverAccount.id, // toAccountId
            amount,
            description,
            'transfer' // transaction type
        );

        console.log("Money sent successfully from", senderUID, "to", receiverUID);
    } catch (error) {
        console.error('Error in sendMoney:', error);
        throw error;
    }
}

//Requests money from another user
export async function requestMoney(requesterUID: string, recipientUID: string, amount: number, description: string) {
    try {
        const requestDocRef = await addDoc(collection(db, 'moneyRequests'), {
            amount: amount,
            description: description,
            requestDate: Timestamp.now(),
            requesterId: `/users/${requesterUID}`,
            senderId: `/users/${recipientUID}`,
            status: 'pending'
        });

        return requestDocRef.id;
    } catch (error) {
        console.error('Failed to create money request:', error);
        throw new Error('Failed to request money');
    }
}

//Accept a request
export async function acceptMoneyRequest(requestId: string, senderUID: string, receiverUID: string, amount: number, description: string) {
    try {
        // Retrieve bank accounts for both sender and receiver
        const senderAccount = await getBankAccountByUID(senderUID);
        const receiverAccount = await getBankAccountByUID(receiverUID);

        // Check if the sender has sufficient balance
        if (senderAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Perform the money transfer by updating balances
        await updateBalance(senderAccount.id, senderAccount.balance - amount);
        await updateBalance(receiverAccount.id, receiverAccount.balance + amount);

        // Log the transaction in the transactions collection
        await logTransaction(
            `/bankAccounts/${senderAccount.id}`,
            `/bankAccounts/${receiverAccount.id}`,
            amount,
            description,
            'transfer'
        );

        // Update the money request status to 'accepted'
        const requestDocRef = doc(db, 'moneyRequests', requestId);
        await updateDoc(requestDocRef, {
            status: 'accepted',
        });
    } catch (error) {
        console.error('Failed to accept money request:', error);
        throw error;
    }
}

//Decline a request
export async function rejectMoneyRequest(requestId: string) {
    try {
        // Update the money request status to 'rejected'
        const requestDocRef = doc(db, 'moneyRequests', requestId);
        await updateDoc(requestDocRef, {
            status: 'rejected'
        });
    } catch (error) {
        console.error('Failed to reject money request:', error);
        throw new Error('Failed to reject money request');
    }
}