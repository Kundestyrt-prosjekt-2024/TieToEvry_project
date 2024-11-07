import { db } from '../../constants/firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

/**Function is used to add a transaction to the database.
 * 
 * @param fromAccountId A string of the id of the sender.
 * @param toAccountId A string of the id of the receiver.
 * @param amount A number of the amount of money to be transferred.
 * @param description A string of the description of the transaction.
 * @param transactionType A string of the type of the transaction. Has to be 'transfer' or 'chore'.
 */
export async function logTransaction(fromAccountId: string, toAccountId: string, amount: number, description: string, transactionType: string) {
    try {
        await addDoc(collection(db, 'transactions'), {
            account_id_from: `/bankAccounts/${fromAccountId}`,
            account_id_to: `/bankAccounts/${toAccountId}`,
            transaction_description: description,
            transaction_amount: amount,
            transaction_type: transactionType,
            transactions_date: Timestamp.now(),
        });

        const senderRef = doc(db, 'bankAccounts', fromAccountId);
        await updateDoc(senderRef, { last_activity_date: Timestamp.now() });

        const receiverRef = doc(db, 'bankAccounts', toAccountId);
        await updateDoc(receiverRef, { last_activity_date: Timestamp.now() });

    } catch (error) {
        throw new Error('Failed to log transaction and update activity dates');
    }
}

/**Function is used to get all transactions made from an account.
 * 
 * @param accountId A string of the id of the account.
 * @returns an array of transactions made from the account.
 */
export async function getTransactionHistory(accountId: string) {
    const transactionsRef = collection(db, 'transactions');

    const q = query(transactionsRef, where('account_id_from', '==', accountId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data());
}