import { db } from '../../constants/firebaseConfig';
import { transferMoney } from '../../backend/src/TransactionService'; 
import { firestore } from 'firebase-admin';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, DocumentReference } from 'firebase/firestore';



type ChoreData = {
    chore_description: string;
    reward_amount: number;
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
export async function approveCompletedChore(choreID: string, childUID: string, rewardAmount: number) {
    try {
        const choreRef = doc(db, 'chores', choreID);
        await updateDoc(choreRef, {
            status: 'paid',
            updated_at: new Date(),
        });
        await transferMoney(childUID, rewardAmount);
    } catch (error) {
        console.error('Error approving completed chore:', error);
        throw new Error('Failed to approve completed chore');
    }
}





//Over funker

const ChoreDAO = {

    async approveSuggestedChore(){

    },

    async declineSuggestedChore(){

    },

    async markChoreComplete(){

    },

    async declineCompletedChore(){

    },

    async approveCompletedChore(){

        // Trigger transferMoney function for the reward amount
        // Mark Chore as paid
    },


    async fetchPendingApprovalChores(){

    }, 

    async fetchPendingPayoutChores(){

    },
    


    async fetchAllChoresForChild(childUID: string){

        
    },

}; 

export default ChoreDAO;