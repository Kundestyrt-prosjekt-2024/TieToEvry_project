import { getDownloadURL, listAll, ref } from "firebase/storage"
import { db, storage } from "../../constants/firebaseConfig"
import { collection, query, where, getDocs, doc, addDoc, updateDoc, Timestamp } from "firebase/firestore"
import { Chore } from "../types/chore"
import { transferMoney } from "./transactionsDAO"
import { adjustSphareCoins } from "./UserDAO"

/**
 * Creates a new chore and saves it to the database.
 *
 * @param {Chore} chore - The chore object containing details about the chore.
 * @throws {Error} - If the chore creation fails.
 */
export async function createChore(chore: Chore) {
  try {
    await addDoc(collection(db, "chores"), chore)
  } catch (error) {
    throw new Error("Failed to add chore")
  }
}

/**
 * Retrieves all chore icons stored in the storage bucket.
 *
 * @returns {Promise<string[]>} - A promise that resolves to an array of URLs for the chore icons.
 * @throws {Error} - If fetching chore icons fails.
 */
export async function getChoreIcons() {
  const folderRef = ref(storage, "Icons")
  try {
    const result = await listAll(folderRef)

    const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef))
    const urls = await Promise.all(urlPromises)
    return urls
  } catch (error) {
    console.error("Error fetching chore icons:", error)
    return []
  }
}

/**
 * Suggests a new chore, setting it to pending status for parental approval.
 *
 * @param {Chore} chore - The chore object to be suggested.
 * @throws {Error} - If the chore suggestion fails.
 */
export async function suggestChore(chore: Chore) {
  createChore(chore)
}

/**
 * Updates the status of a chore and optionally handles associated rewards.
 *
 * @param {Chore} chore - The chore object containing updated information.
 * @param {string} status - The new status of the chore (e.g., "approved", "completed").
 * @throws {Error} - If updating the chore status fails.
 */
export async function updateChoreStatus(chore: Chore, status: string) {
  try {
    const choreRef = doc(db, "chores", chore.id!)
    await updateDoc(choreRef, {
      chore_status: status,
      paid: chore.paid,
    })

    if (chore.paid) {
      await transferMoney(chore.parent_id, chore.child_id, chore.reward_amount, chore.chore_title)
      await adjustSphareCoins(chore.child_id, 3)
    }
  } catch (error) {
    console.error("Error updating status of chore:", error)
    throw new Error("Failed to update suggested chore")
  }
}

/**
 * Fetches chores for a specific child based on a given status.
 *
 * @param {string} childID - The unique ID of the child.
 * @param {string} status - The status of chores to filter by (e.g., "pending", "approved").
 * @returns {Promise<Chore[]>} - A promise that resolves to an array of chores matching the specified status.
 * @throws {Error} - If fetching chores by status fails.
 */
export async function getChoresByStatus(childID: string, status: string) {
  const chores: Chore[] = []
  try {
    const choresQuery = query(
      collection(db, "chores"),
      where("child_id", "==", childID),
      where("chore_status", "==", status)
    )
    const querySnapshot = await getDocs(choresQuery)
    querySnapshot.forEach((doc) => {
      chores.push({ id: doc.id, ...doc.data() } as Chore)
    })

    const recurringChores = chores.filter((chore) => chore.recurrence)
    const nonRecurringChores = chores.filter((chore) => !chore.recurrence)

    // Update recurring chores if their time_limit has passed and return the combined list
    const updatedRecurringChores = await handleRecurringChores(recurringChores)

    return [...nonRecurringChores, ...updatedRecurringChores]
  } catch (error) {
    console.error("Error fetching chores with status " + status + ": ", error)
    throw new Error("Failed to fetch chores with status " + status)
  }
}

/**
 * Fetches all chores for a specific child, regardless of status.
 *
 * @param {string} childID - The unique ID of the child.
 * @returns {Promise<Chore[]>} - A promise that resolves to an array of all chores for the child.
 * @throws {Error} - If fetching all chores fails.
 */
export async function getAllChores(childID: string) {
  const allChores: Chore[] = []
  try {
    const choresQuery = query(collection(db, "chores"), where("child_id", "==", childID))
    const querySnapshot = await getDocs(choresQuery)
    querySnapshot.forEach((doc) => {
      allChores.push({ id: doc.id, ...doc.data() } as Chore)
    })

    const recurringChores = allChores.filter((chore) => chore.recurrence)
    const nonRecurringChores = allChores.filter((chore) => !chore.recurrence)

    // Update recurring chores if their time_limit has passed and return the combined list
    const updatedRecurringChores = await handleRecurringChores(recurringChores)

    return [...nonRecurringChores, ...updatedRecurringChores]
  } catch (error) {
    console.error("Error fetching all chores for child:", error)
    throw new Error("Failed to fetch all chores for child")
  }
}

/**
 * Updates the time limit of recurring chores if their time limit has passed.
 *
 * @param {Chore[]} recurringChores - An array of recurring chores to be handled.
 * @returns {Promise<Chore[]>} - A promise that resolves to an array of updated recurring chores.
 * @throws {Error} - If handling recurring chores fails.
 */
async function handleRecurringChores(recurringChores: Chore[]) {
  try {
    const updatedChores: Chore[] = []
    const now = new Date()
    recurringChores.forEach((chore) => {
      if (!chore.time_limit) {
        return
      }
      const nextTimeLimit = new Date(chore.time_limit.seconds * 1000 + chore.time_limit.nanoseconds / 1000000)
      if (now > nextTimeLimit) {
        switch (chore.recurrence) {
          case "daily":
            nextTimeLimit.setDate(nextTimeLimit.getDate() + 1)
            break
          case "weekly":
            nextTimeLimit.setDate(nextTimeLimit.getDate() + 7)
            break
          case "monthly":
            nextTimeLimit.setMonth(nextTimeLimit.getMonth() + 1)
            break
        }
        const updatedChore: Chore = {
          ...chore,
          time_limit: Timestamp.fromDate(nextTimeLimit),
        }
        updatedChores.push(updatedChore)
      } else {
        updatedChores.push(chore)
      }
    })
    return updatedChores
  } catch (error) {
    console.error("Error handling recurring chores:", error)
    throw new Error("Failed to handle recurring chores")
  }
}
