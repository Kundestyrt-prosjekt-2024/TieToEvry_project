import { addDoc, collection } from "firebase/firestore"
import { Chore } from "../types/chore"
import { db } from "@/constants/firebaseConfig"

export async function createChore(chore: Chore) {
  try {
    await addDoc(collection(db, "chores"), chore)
  } catch (error) {
    throw new Error("Failed to add chore")
  }
}
