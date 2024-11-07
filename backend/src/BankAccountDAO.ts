import { db } from '../../constants/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { BankAccount } from '../types/bankAccount';

/**Funtion is used to get a bank account by its a users userID
 * 
 * @param userUID A string of the id of the user.
 * @returns the id of the account and the account information
 */
export async function getBankAccountByUID(userUID: string): Promise<BankAccount & {id: string}> {
    try {
        const bankAccountsRef = collection(db, 'bankAccounts');
        const q = query(bankAccountsRef, where("UID", "==", userUID));
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("Bank account not found");
        }
        
        const doc = querySnapshot.docs[0];
        const data = doc.data() as BankAccount;

        if (typeof data.balance !== 'number') {
            throw new Error("Invalid or missing 'balance' field in bank account document");
        }

        return {id: doc.id,
            ...data};
    } catch (error) {
        throw new Error('Failed to get bank account by UID');
    }
}

/**Function is used to update the balance of a bank account.
 * 
 * @param accountId A string of the id of the account.
 * @param newBalance A number of the new balance of the account.
 */
export async function updateBalance(accountId: string, newBalance: number) {
    const accountDocRef = doc(db, 'bankAccounts', accountId);

    try {
        await updateDoc(accountDocRef, { balance: newBalance });
    } catch (error) {
        throw new Error('Failed to update balance');
    }
}