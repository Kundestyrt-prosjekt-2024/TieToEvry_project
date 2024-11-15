import { db } from "@/constants/firebaseConfig"
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { User } from "../types/user"


export async function addUser(user: User): Promise<string | undefined> {
  try {
    const docRef = doc(db, "users", user.uid)
    if (user.profilePicture == "" || user.profilePicture == undefined) {
      user.profilePicture = "https://firebasestorage.googleapis.com/v0/b/mobile-banking-app-dacb3.appspot.com/o/Profile%20Pictures%2FDefault_pfp.png?alt=media&token=3c5ea107-33ee-4b7b-8df6-4ab8b3522aaa"
    }
    await setDoc(docRef, user)
    return user.uid
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function addChildToParent(parentUid: string, childUid: string): Promise<string | undefined> {
  try {
    const childDocRef = doc(db, "users", childUid)
    // await setDoc(childDocRef, data, { merge: true })

    const parentDocRef = doc(db, "users", parentUid)
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
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    } else { 
      throw new Error("User not found")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function updateProfilePicture(uid: string, url: string): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid)
    await updateDoc(userDocRef, {
      profilePicture: url,
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function fetchParents(uid: string): Promise<string[]> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data()!.parents
    } else {
      throw new Error("User not found")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
