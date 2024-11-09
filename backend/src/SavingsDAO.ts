import { db } from "@/constants/firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc, getDocsFromServer, getDocsFromCache, updateDoc, increment } from "firebase/firestore";
import { SavingGoal, SavingGoalSchema } from "../types/savingGoal";
import { adjustBalance, getBankAccountByUID } from "./bankAccountDAO";

/**
 * Function that returns an array of saving goals for a specific user based on the user's id
 * 
 * @param userId A string of the id of the user.
 * @returns the saving goals for a given user ID.
 * 
 */
export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  try {
    const savingGoalsCollection = collection(db, "savingGoals");

    const q = query(savingGoalsCollection, where("child_id", "==", userId));

    // Can use getDocsFromServer or getDocsFromCache instead if we want spesific fetching.
    const querySnapshot = await getDocs(q);

    const savingGoals: SavingGoal[] = [];
    querySnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        savingGoals.push({
          id: docSnap.id,
          ...(docSnap.data() as SavingGoal),
        });
      }
    });
    if (savingGoals.length === 0) {
      throw new Error("No saving goals found for this user");
    }

    return savingGoals;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Function for creating new saving goal for a user.
 * 
 * @param savingGoal A saving goal object.
 * @returns a boolean value that indicates if the saving goal was created successfully.
 * 
 */
export async function addSavingGoal(savingGoal: SavingGoal): Promise<boolean> {
    try {
        const savingGoals = doc(collection(db, 'savingGoals'));
        // Use zod parse to ensure that the savingGoal object is of the correct type
        SavingGoalSchema.parse(savingGoal);

        // Need to spread the data in the object as we dont want to store the object itself, but rather the data in the object.
        await setDoc(savingGoals, {...savingGoal});
        console.log('New goal created:', savingGoal);
        return true
    } catch (error) {
        console.error('Error creating saving goal:', error);
        throw new Error('Failed to create saving goal');
    }
}

/**
 * Function for updating a saving goal with new amount
 * 
 * @param savingGoal A saving goal object.
 * @param amount A number that represents how much a user wants to allocate to the saving goal.
 * @returns a boolean value that indicates if the saving goal was updated successfully.
 * 
 */
export async function updateSavingGoal(savingGoal: SavingGoal, amount: number): Promise<boolean> {
  try {
    if (!savingGoal.id) {
      throw new Error("Saving goal ID is undefined");
    }
    const docRef = doc(db, "savingGoals", savingGoal.id);
    const account = await getBankAccountByUID(savingGoal.child_id);

    if (account.balance - amount >= 0){
      // Use atomic increment to safely update the current amount
      await updateDoc(docRef, {current_amount: increment(amount)});
      await adjustBalance(account.id, -amount);
      console.log('Updated saving goal:', savingGoal);
      return true;
    } else{
      console.log('Not enough funds to update saving goal:', savingGoal);
      return false;
    }

  } catch (error) {
    console.error("Could not update saving goal:", error);
    throw new Error("Failed to update saving goal");
  }
}

