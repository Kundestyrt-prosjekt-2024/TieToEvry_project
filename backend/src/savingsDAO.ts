import { db } from "@/constants/firebaseConfig"
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore"
import { SavingGoal, SavingGoalSchema } from "../types/savingGoal"
import { adjustBalance, getBankAccountByUID } from "./bankAccountDAO"

/**
 * Retrieves all saving goals associated with a specific user.
 *
 * @param {string} userId - The ID of the user whose saving goals are to be fetched.
 * @returns {Promise<SavingGoal[]>} - A promise that resolves to an array of saving goals.
 * @throws {Error} - If no saving goals are found or if fetching fails.
 */
export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  try {
    const savingGoalsCollection = collection(db, "savingGoals")

    const q = query(savingGoalsCollection, where("child_id", "==", userId))

    // Can use getDocsFromServer or getDocsFromCache instead if we want spesific fetching.
    const querySnapshot = await getDocs(q)

    const savingGoals: SavingGoal[] = []
    querySnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        savingGoals.push({
          id: docSnap.id,
          ...(docSnap.data() as SavingGoal),
        })
      }
    })
    if (savingGoals.length === 0) {
      throw new Error("No saving goals found for this user")
    }

    return savingGoals
  } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * Creates a new saving goal for a user.
 *
 * @param {SavingGoal} savingGoal - The saving goal object to be created.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the saving goal was created successfully.
 * @throws {Error} - If the saving goal creation fails or the input data is invalid.
 */
export async function addSavingGoal(savingGoal: SavingGoal): Promise<boolean> {
  try {
    const savingGoals = doc(collection(db, "savingGoals"))
    // Use zod parse to ensure that the savingGoal object is of the correct type
    SavingGoalSchema.parse(savingGoal)

    // Need to spread the data in the object as we dont want to store the object itself, but rather the data in the object.
    await setDoc(savingGoals, { ...savingGoal })
    console.log("New goal created:", savingGoal.title)
    return true
  } catch (error) {
    console.error("Error creating saving goal:", error)
    throw new Error("Failed to create saving goal")
  }
}

/**
 * Updates an existing saving goal by adding a specified amount to its current value.
 *
 * @param {SavingGoal} savingGoal - The saving goal object to be updated.
 * @param {number} amount - The amount to allocate to the saving goal.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the saving goal was updated successfully.
 * @throws {Error} - If the saving goal ID is undefined, updating the saving goal fails, or there are insufficient funds.
 */
export async function updateSavingGoal(savingGoal: SavingGoal, amount: number): Promise<boolean> {
  try {
    if (!savingGoal.id) {
      throw new Error("Saving goal ID is undefined")
    }
    const docRef = doc(db, "savingGoals", savingGoal.id)
    const account = await getBankAccountByUID(savingGoal.child_id)

    // Use atomic increment to safely update the current amount
    await adjustBalance(account.id, -amount)
    await updateDoc(docRef, { current_amount: increment(amount) })
    console.log("Updated saving goal:", savingGoal.title)
    return true
  } catch (error) {
    console.error("Could not update saving goal:", error)
    throw new Error("Failed to update saving goal")
  }
}

/**
 * Marks a saving goal as complete, transferring its goal amount to the user's account.
 *
 * @param {SavingGoal} savingGoal - The saving goal object to be marked as complete.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the saving goal was completed successfully.
 * @throws {Error} - If the saving goal ID is undefined or completing the saving goal fails.
 */
export async function completedGoal(savingGoal: SavingGoal): Promise<boolean> {
  try {
    if (!savingGoal.id) {
      throw new Error("Saving goal ID is undefined")
    }
    const docRef = doc(db, "savingGoals", savingGoal.id)
    const account = await getBankAccountByUID(savingGoal.child_id)

    await adjustBalance(account.id, savingGoal.goal_amount)
    await updateDoc(docRef, { complete: true })
    console.log("Completed saving goal. Money deposited", savingGoal.title, ":", savingGoal.goal_amount)
    return true
  } catch (error) {
    console.error("Could not deposit money:", error)
    throw new Error("Failed to complete saving goal")
  }
}
