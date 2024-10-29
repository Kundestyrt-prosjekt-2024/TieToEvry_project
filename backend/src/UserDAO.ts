import { db } from "@/constants/firebaseConfig"
import "firebase/firestore"
import { setDoc, doc, Firestore, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { User } from "../types/user"


const database: Firestore = db


export async function addUser(uid: string, data: User): Promise<string | undefined> {
  try {
    const docRef = doc(database, "users", uid)
    await setDoc(docRef, data)
    return uid
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function addChildToParent(parentUid: string, childUid: string, data: User): Promise<string | undefined> {
  try {
    const childDocRef = doc(database, "users", childUid)
    await setDoc(childDocRef, data, { merge: true })

    const parentDocRef = doc(database, "users", parentUid)
    await updateDoc(parentDocRef, {
      children: arrayUnion(childUid),
    })

    return childUid
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getUser(uid: string): Promise<User | undefined> {
  try {
    const userDoc = await getDoc(doc(database, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    } else { 
      throw new Error("User not found")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

