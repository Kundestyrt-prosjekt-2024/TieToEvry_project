import { db } from '../../constants/firebaseConfig';
import { transferMoney } from '../../backend/src/TransactionService'; 
import { firestore } from 'firebase-admin';



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

const ChoreDAO = {

    async createChore(childUID: string, choreData: ChoreData){
        try {
            const choreRef = db.collection('chores').doc();
            await choreRef.set({
                ...choreData,
                child_id: childUID,
                status: 'approved',
                created_at: firestore.FieldValue.serverTimestamp(),
                updated_at: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.error('Error creating chore:', error);
        }
    },

    async suggestChore(childUID: string, choreData: ChoreData) {

    },

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