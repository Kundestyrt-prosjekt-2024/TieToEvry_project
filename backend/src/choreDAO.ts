import { db } from '../../constants/firebaseConfig';
import { transferMoney } from '../../backend/src/TransactionService'; //File will be available when merged
import { firestore } from 'firebase-admin';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, DocumentReference, orderBy } from 'firebase/firestore';

type ChoreData = {
    chore_description?: string;
    reward_amount?: number;
    time_limit?: Date;
    is_repeatable?: boolean;
    recurrence?: 'daily' | 'weekly' | 'monthly';
    status?: 'pending' | 'approved' | 'completed' | 'paid' | 'declined';
    created_at?: Date;
    updated_at?: Date;
};

//Parents can create chores which are set as approved by default
export async function createChore(childUID: string, choreData: ChoreData) {
    try {
        const choreRef = doc(collection(db, 'chores'));
        await setDoc(choreRef, {
            ...choreData,
            child_id: childUID,
            status: 'approved',
            created_at: new Date(),
            updated_at: new Date(),
        });
    } catch (error) {
        console.error('Error creating chore:', error);
        throw new Error('Failed to create chore');
    }
}


//Kids can create chores but they are set to pending awaiting approval by parents
export async function suggestChore(childUID: string, choreData: ChoreData) {
    try {
        const choreRef = doc(collection(db, 'chores'));
        await setDoc(choreRef, {
            ...choreData,
            child_id: childUID,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
        });
    } catch (error) {
        console.error('Error suggesting chore:', error);
        throw new Error('Failed to suggest chore');
    }
}

//Parents can approve a suggested chore, which marks it as approved
export async function approveSuggestedChore(choreID: string) {
    try {
        const choreRef = doc(db, 'chores', choreID);
        await updateDoc(choreRef, {
            status: 'approved',
            updated_at: new Date(),
        });
    } catch (error) {
        console.error('Error approving suggested chore:', error);
        throw new Error('Failed to approve suggested chore');
    }
}


//Parents can decline a chore, marking it as declined
export async function declineSuggestedChore(choreID: string) {
    try {
        const choreRef = doc(db, 'chores', choreID);
        await updateDoc(choreRef, {
            status: 'declined',
            updated_at: new Date(),
        });
    } catch (error) {
        console.error('Error declining suggested chore:', error);
        throw new Error('Failed to decline suggested chore');
    }
}

//Children can mark a chore as completed, awaiting approval by a parent to be paid out
export async function markChoreComplete(choreID: string) {
    try {
        const choreRef = doc(db, 'chores', choreID);
        await updateDoc(choreRef, {
            status: 'completed',
            updated_at: new Date(),
        });
    } catch (error) {
        console.error('Error marking chore complete:', error);
        throw new Error('Failed to mark chore as complete');
    }
}

//Parents can decline a completed chore, marking it as approved again and ready to be done and marked complete by a child again
export async function declineCompletedChore(choreID: string) {
    try {
        const choreRef = doc(db, 'chores', choreID);
        await updateDoc(choreRef, {
            status: 'approved',
            updated_at: new Date(),
        });
    } catch (error) {
        console.error('Error declining completed chore:', error);
        throw new Error('Failed to decline completed chore');
    }
}

//Parents can approve a completed chore to set it as paid and trigger the transfer
export async function approveCompletedChore(choreID: string, parentUID: string, childUID: string, rewardAmount: number) {
    try {
        const choreRef = doc(db, 'chores', choreID);
        await updateDoc(choreRef, {
            status: 'paid',
            updated_at: new Date(),
        });
        await transferMoney(parentUID, childUID, rewardAmount, "Chore Completion Reward", "chore_reward");
    } catch (error) {
        console.error('Error approving completed chore:', error);
        throw new Error('Failed to approve completed chore');
    }
}

//Parents can fetch all chores that are suggested by a child with a childUID
export async function fetchPendingApprovalChores(childUID: string): Promise<ChoreData[]> {
    const chores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(choresQuery);
        querySnapshot.forEach((doc) => {
            chores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });
    } catch (error) {
        console.error('Error fetching pending approval chores:', error);
        throw new Error('Failed to fetch pending approval chores');
    }
    return chores;
}

//Parents can fetch all chores that are completed and awaiting approval and payout
export async function fetchPendingPayoutChores(childUID: string): Promise<ChoreData[]> {
    const chores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'completed')
        );
        const querySnapshot = await getDocs(choresQuery);
        querySnapshot.forEach((doc) => {
            chores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });
    } catch (error) {
        console.error('Error fetching pending payout chores:', error);
        throw new Error('Failed to fetch pending payout chores');
    }
    return chores;
}

//All chores for a child can be fetched, including all the different chore statuses
export async function fetchAllChoresForChild(childUID: string): Promise<ChoreData[]> {
    const allChores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
        );
        const querySnapshot = await getDocs(choresQuery);
        querySnapshot.forEach((doc) => {
            allChores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });
        const recurringChores = allChores.filter(chore => chore.recurrence);
        const nonRecurringChores = allChores.filter(chore => !chore.recurrence);

        // Update recurring chores if their time_limit has passed and return the combined list
        const updatedRecurringChores = await handleRecurringChores(recurringChores);
        return [...nonRecurringChores, ...updatedRecurringChores];
    } catch (error) {
        console.error('Error fetching all chores for child:', error);
        throw new Error('Failed to fetch all chores for child');
    }
}

//Fetch only pending chores for child
export async function fetchPendingChoresForChild(childUID: string): Promise<ChoreData[]> {
    const pendingChores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(choresQuery);
        
        // Collect all chores marked as 'pending'
        querySnapshot.forEach((doc) => {
            pendingChores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });

        // Separate chores into recurring and non-recurring
        const recurringChores = pendingChores.filter(chore => chore.recurrence);
        const nonRecurringChores = pendingChores.filter(chore => !chore.recurrence);

        // Update recurring chores if their time_limit has passed and return the combined list
        const updatedRecurringChores = await handleRecurringChores(recurringChores);
        return [...nonRecurringChores, ...updatedRecurringChores];
    } catch (error) {
        console.error('Error fetching pending chores for child:', error);
        throw new Error('Failed to fetch pending chores for child');
    }
}



//Fetch only approved chores for child
export async function fetchApprovedChoresForChild(childUID: string): Promise<ChoreData[]> {
    const approvedChores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'approved')
        );
        const querySnapshot = await getDocs(choresQuery);
        
        // Collect all chores marked as 'approved'
        querySnapshot.forEach((doc) => {
            approvedChores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });

        // Separate chores into recurring and non-recurring
        const recurringChores = approvedChores.filter(chore => chore.recurrence);
        const nonRecurringChores = approvedChores.filter(chore => !chore.recurrence);

        // Update recurring chores if their time_limit has passed and return the combined list
        const updatedRecurringChores = await handleRecurringChores(recurringChores);
        return [...nonRecurringChores, ...updatedRecurringChores];
    } catch (error) {
        console.error('Error fetching approved chores for child:', error);
        throw new Error('Failed to fetch approved chores for child');
    }
}

//Fetch only completed chores for child
export async function fetchCompletedChoresForChild(childUID: string): Promise<ChoreData[]> {
    const completedChores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'completed')
        );
        const querySnapshot = await getDocs(choresQuery);
        
        // Collect all chores marked as 'completed'
        querySnapshot.forEach((doc) => {
            completedChores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });

        // Separate chores into recurring and non-recurring
        const recurringChores = completedChores.filter(chore => chore.recurrence);
        const nonRecurringChores = completedChores.filter(chore => !chore.recurrence);

        // Update recurring chores if their time_limit has passed and return the combined list
        const updatedRecurringChores = await handleRecurringChores(recurringChores);
        return [...nonRecurringChores, ...updatedRecurringChores];
    } catch (error) {
        console.error('Error fetching completed chores for child:', error);
        throw new Error('Failed to fetch completed chores for child');
    }
}


//Fetch only paid chores for child
export async function fetchPaidChoresForChild(childUID: string): Promise<ChoreData[]> {
    const paidChores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'paid')
        );
        const querySnapshot = await getDocs(choresQuery);
        
        // Collect all chores marked as 'paid'
        querySnapshot.forEach((doc) => {
            paidChores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });

        // Separate chores into recurring and non-recurring
        const recurringChores = paidChores.filter(chore => chore.recurrence);
        const nonRecurringChores = paidChores.filter(chore => !chore.recurrence);

        // Update recurring chores if their time_limit has passed and return the combined list
        const updatedRecurringChores = await handleRecurringChores(recurringChores);
        return [...nonRecurringChores, ...updatedRecurringChores];
    } catch (error) {
        console.error('Error fetching paid chores for child:', error);
        throw new Error('Failed to fetch paid chores for child');
    }
}


//Fetch only declined chores for child
export async function fetchDeclinedChoresForChild(childUID: string): Promise<ChoreData[]> {
    const declinedChores: ChoreData[] = [];
    try {
        const choresQuery = query(
            collection(db, 'chores'),
            where('child_id', '==', childUID),
            where('status', '==', 'declined')
        );
        const querySnapshot = await getDocs(choresQuery);
        
        // Collect all chores marked as 'declined'
        querySnapshot.forEach((doc) => {
            declinedChores.push({ id: doc.id, ...doc.data() } as ChoreData);
        });

        // Separate chores into recurring and non-recurring
        const recurringChores = declinedChores.filter(chore => chore.recurrence);
        const nonRecurringChores = declinedChores.filter(chore => !chore.recurrence);

        // Update recurring chores if their time_limit has passed and return the combined list
        const updatedRecurringChores = await handleRecurringChores(recurringChores);
        return [...nonRecurringChores, ...updatedRecurringChores];
    } catch (error) {
        console.error('Error fetching delined chores for child:', error);
        throw new Error('Failed to fetch declined chores for child');
    }
}



// Updates the time_limit of recurring chores that have passed their time_limit
export async function handleRecurringChores(recurringChores: ChoreData[]) {
    try {
        const updatedChores: ChoreData[] = [];
        const now = new Date();
        recurringChores.forEach(chore => {
            if (!chore.time_limit) {
                return;
            }
            if (now > chore.time_limit) {
                const nextTimeLimit = new Date(chore.time_limit);
                switch (chore.recurrence) {
                    case 'daily':
                        nextTimeLimit.setDate(nextTimeLimit.getDate() + 1);
                        break;
                    case 'weekly':
                        nextTimeLimit.setDate(nextTimeLimit.getDate() + 7);
                        break;
                    case 'monthly':
                        nextTimeLimit.setMonth(nextTimeLimit.getMonth() + 1);
                        break;
                }
                const updatedChore: ChoreData = {
                    ...chore,
                    time_limit: nextTimeLimit,
                };
                updatedChores.push(updatedChore);
            } else {
                updatedChores.push(chore);
            }
        });
        return updatedChores;
    } catch (error) {
        console.error('Error handling recurring chores:', error);
        throw new Error('Failed to handle recurring chores');
    }
}