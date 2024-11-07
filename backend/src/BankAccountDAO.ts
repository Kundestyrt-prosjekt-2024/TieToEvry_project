import { db } from '../../constants/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, DocumentData } from 'firebase/firestore';

interface BankAccount {
    id: string;
    balance: number;
    [key: string]: any; // Allows additional properties if present
}

export async function getBankAccountByUID(userUID: string): Promise<BankAccount> {
    try {
        console.log("Searching for bank account with UID:", userUID);
        const bankAccountsRef = collection(db, 'bankAccounts');
        const q = query(bankAccountsRef, where("UID", "==", userUID));
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("Bank account not found");
        }
        
        const doc = querySnapshot.docs[0];
        const data = doc.data() as DocumentData;

        // Check if balance exists and is a number
        if (typeof data.balance !== 'number') {
            throw new Error("Invalid or missing 'balance' field in bank account document");
        }

        return { id: doc.id, ...data } as BankAccount;
    } catch (error) {
        console.error("Error in getBankAccountByUID:", error);
        throw error;
    }
}

//Updates the balance of a bank account
    export async function updateBalance(accountId: string, newBalance: number) {
        const accountDocRef = doc(db, 'bankAccounts', accountId);
    
        try {
            await updateDoc(accountDocRef, { balance: newBalance });
        } catch (error) {
            throw new Error('Failed to update balance');
        }
    }