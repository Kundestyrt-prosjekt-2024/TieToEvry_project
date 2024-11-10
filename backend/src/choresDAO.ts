import { addDoc, collection } from "firebase/firestore"
import { Chore } from "../types/chore"
import { db, storage } from "@/constants/firebaseConfig"
import { getDownloadURL, listAll, ref } from "firebase/storage"

export async function createChore(chore: Chore) {
  try {
    await addDoc(collection(db, "chores"), chore)
  } catch (error) {
    throw new Error("Failed to add chore")
  }
}

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
