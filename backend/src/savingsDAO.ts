import { db } from "@/constants/firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc, getDocsFromServer, getDocsFromCache, updateDoc, increment } from "firebase/firestore";
import { SavingGoal, SavingGoalSchema } from "../types/savingGoal";

//Function that returns an array of saving goals for a specific user based on the user's id
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

// Function for creating new saving goal
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

// Function for updating a saving goal with new amount
export async function updateSavingGoal(savingGoal: SavingGoal, amount: number): Promise<boolean> {
  try {
    if (!savingGoal.id) {
      throw new Error("Saving goal ID is undefined");
    }
    const docRef = doc(db, "savingGoals", savingGoal.id);

    // Use atomic increment to safely update the current amount
    await updateDoc(docRef, {
      current_amount: increment(amount)
    });

    console.log('Updated saving goal:', savingGoal);
    return true;
  } catch (error) {
    console.error("Could not update saving goal:", error);
    throw new Error("Failed to update saving goal");
  }
}
