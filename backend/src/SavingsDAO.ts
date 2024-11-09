import { db } from "@/constants/firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc, getDocsFromServer } from "firebase/firestore";
import { SavingGoal, SavingGoalSchema } from "../types/savingGoal";

//Function that returns an array of saving goals for a specific user based on the user's id
export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  try {
    const savingGoalsCollection = collection(db, "savingGoals");

    const q = query(savingGoalsCollection, where("child_id", "==", userId));

    // Can use getDocs or getDocsFromcache instead, but for this case we want to fetch from the server
    // Get docs from the server
    const querySnapshot = await getDocsFromServer(q);
    // console.log(querySnapshot);

    // Does not seem to fetch newest data from the server. Only fetches two instances.
    const savingGoals: SavingGoal[] = [];
    querySnapshot.forEach((docSnap) => {
      console.log(docSnap.data());
      // if (docSnap.exists()) {
      //   savingGoals.push({
      //     id: docSnap.id,
      //     ...(docSnap.data() as SavingGoal),
      //   });
      // }
    });

    if (savingGoals.length === 0) {
      throw new Error("No saving goals found for this user");
    }

    return savingGoals;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Function for creating new saving goal

export async function addSavingGoal(savingGoal: SavingGoal): Promise<boolean> {
    try {
        const savingGoals = doc(collection(db, 'savingGoals'));
        // Use zod parse to ensure that the savingGoal object is of the correct type
        SavingGoalSchema.parse(savingGoal);
        // Store the saving goal in the database
        await setDoc(savingGoals, {savingGoal});
        return true
    } catch (error) {
        console.error('Error creating saving goal:', error);
        throw new Error('Failed to create chore');
    }
}

/**
 * TODO: Add updateSavingGoal function for adding money to the current_amount field.
 */

