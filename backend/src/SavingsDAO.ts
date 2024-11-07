import { db } from "@/constants/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { SavingGoal } from "../types/savingGoal";

//Function that returns an array of saving goals for a specific user based on the user's id
export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  try {
    const savingGoalsCollection = collection(db, "savingGoals");

    const q = query(savingGoalsCollection, where("child_id", "==", userId));

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
 * TODO: Add function for adding new saving goal
 */

/**
 * TODO: Add updateSavingGoal function for adding money to the current_amount field.
 */

