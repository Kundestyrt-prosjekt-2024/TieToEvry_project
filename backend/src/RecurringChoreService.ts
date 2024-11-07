import { db } from '../../constants/firebaseConfig';



//For all chores where is_repeatable: true, add a recurrence that creates a new instance of the chore if the current date exceeds the time_limit and base it off the recurrence schedule (daily, weekly or monthly)



const RecurringChoreService = {
    async processRecurringChores() {
        const now = new Date();

        //Fetch all relevant chores marked as repeatable

        //If it's time to recur, create a new instance of the chore and delete the old one
    }, 


    getNextTimeLimit(currentTimeLimit: Date, recurrence?: 'daily' |'weekly'|'monthly'): Date {
        const nextTimeLimit = new Date(currentTimeLimit);
        switch (recurrence) {
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
        return nextTimeLimit;
    }

};

export default RecurringChoreService;