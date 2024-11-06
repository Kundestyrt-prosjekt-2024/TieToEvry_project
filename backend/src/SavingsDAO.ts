import { db } from "@/constants/firebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { SavingGoal } from "../types/savingGoal";


//Function that returns an array of saving goals for a specific user based on the user's id
export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  try {
    const savingGoalsCollection = collection(db, "savingGoals");
    const q = query(savingGoalsCollection, where("child_id", "==", userId));
    const querySnapshot = await getDocs(q);

    const savingGoals: SavingGoal[] = [];
    querySnapshot.forEach((docSnap) => {
      savingGoals.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as SavingGoal);
    });
    return savingGoals;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

//Function that adds a new saving goal to the database
export async function addSavingGoal(data: SavingGoal): Promise<string | undefined> {
  try {
    const docRef = await addDoc(collection(db, "savingGoals"), data);
    return docRef.id;
    } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * TODO: Add updateSavingGoal function for adding money to the current_amount field.
 */