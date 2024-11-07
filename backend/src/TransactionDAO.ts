import { db } from '../../constants/firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

//Logs a transaction
export async function logTransaction(fromAccountId: string, toAccountId: string, amount: number, description: string, transactionType: string = 'transfer') {
    try {
        // Log the transaction
        await addDoc(collection(db, 'transactions'), {
            account_id_from: `/bankAccounts/${fromAccountId}`,
            account_id_to: `/bankAccounts/${toAccountId}`,
            transaction_description: description,
            transaction_amount: amount,
            transaction_type: transactionType,
            transactions_date: Timestamp.now(),
        });

        // Update last_activity_date of sender bank account
        const senderRef = doc(db, 'bankAccounts', fromAccountId);
        await updateDoc(senderRef, { last_activity_date: Timestamp.now() });

        // Update last_activity_date of receiver bank account
        const receiverRef = doc(db, 'bankAccounts', toAccountId);
        await updateDoc(receiverRef, { last_activity_date: Timestamp.now() });

        console.log('Transaction logged and last activity dates updated.');
    } catch (error) {
        console.error('Failed to log transaction and update activity dates:', error);
        throw new Error('Failed to log transaction and update activity dates');
    }
}

//Retrieves the transaction history for a given account.
export async function getTransactionHistory(accountId: string) {
    const transactionsRef = collection(db, 'transactions');

    const q = query(transactionsRef, where('account_id_from', '==', accountId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data());
}