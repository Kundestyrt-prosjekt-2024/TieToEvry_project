import { db } from "@/constants/firebaseConfig"
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteField,
  deleteDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore"
import { User } from "../types/user"
import { getAuth } from "firebase/auth"

export async function addUser(uid: string, data: User): Promise<string | undefined> {
  try {
    const docRef = doc(db, "users", uid)
    if (data.profilePicture == "" || data.profilePicture == undefined) {
      data.profilePicture =
        "https://firebasestorage.googleapis.com/v0/b/mobile-banking-app-dacb3.appspot.com/o/Profile%20Pictures%2FDefault_pfp.png?alt=media&token=3c5ea107-33ee-4b7b-8df6-4ab8b3522aaa"
    }
    await setDoc(docRef, data)
    return uid
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function addChildToParent(parentUid: string, childUid: string, data: User): Promise<string | undefined> {
  try {
    const childDocRef = doc(db, "users", childUid)
    await setDoc(childDocRef, data, { merge: true })

    const parentDocRef = doc(db, "users", parentUid)
    await updateDoc(parentDocRef, {
      children: arrayUnion(childUid),
    })

    return childUid
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getUser(uid: string, updateUserAccount?: (updatedData: User) => void): Promise<User | undefined> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      const userData = userDoc.data() as User
      const user = { ...userData, id: uid }
      if (updateUserAccount) {
        const unsubscribe = onSnapshot(doc(db, "users", user.id), (updatedDoc) => {
          if (updatedDoc.exists()) {
            const updatedData = updatedDoc.data() as User
            updateUserAccount(updatedData)
          }
        })
      }
      return user
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

/**
 * Function is used to adjust sphareCoins of a user by a specified amount.
 *
 * @param accountId A string of the id of the user.
 * @param amount A number representing the amount to adjust sphareCoins by (can be positive or negative).
 */
export async function adjustSphareCoins(uid: string, amount: number) {
  const userDocRef = doc(db, "users", uid)
  try {
    // Retrieve current sphareCoins
    const userSnapshot = await getDoc(userDocRef)
    if (!userSnapshot.exists()) {
      throw new Error("User not found")
    }
    // Get current sphareCoins
    const currentSphareCoins = userSnapshot.data().sphareCoins || 0
    // Calculate new sphareCoins
    const newSphareCoins = currentSphareCoins + amount
    // Ensure new sphareCoins is not negative
    if (newSphareCoins < 0) {
      throw new Error("Insufficient funds for this operation")
    }
    // Update the document with new sphareCoins
    await updateDoc(userDocRef, { sphareCoins: newSphareCoins })
  } catch (e) {
    throw new Error("Failed to adjust sphareCoins: " + e)
  }
}

export async function deleteUser(user: User): Promise<boolean> {
  try {
    if (!user.id) {
      throw new Error("User ID is undefined")
    }
    const auth = getAuth()
    const userAuth = auth.currentUser
    const docRef = doc(db, "users", user.id)

    // Remove user from parents' children list
    for (const parentId of user.parents || []) {
      try {
        console.log("Removing user from parent: ", parentId)
        await removeChildFromParent(parentId, user.id)
      } catch (error: any) {
        console.warn(`Failed to remove child from parent ${parentId}: ${error.message}`)
      }
    }

    await userAuth?.delete()
    await deleteDoc(docRef)

    return true
  } catch (error: any) {
    console.error(`Error in deleteUser: ${error.message} user: ${user.id}`)
    throw new Error(error.message)
  }
}

export async function removeChildFromParent(parentUid: string, childUid: string): Promise<void> {
  try {
    const parentDocRef = doc(db, "users", parentUid)
    await updateDoc(parentDocRef, {
      children: arrayRemove(childUid),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function removeChildIfLastParent(childUid: string, currentParentId: string): Promise<void> {
  try {
    const childDocRef = doc(db, "users", childUid)
    const childDoc = await getDoc(childDocRef)

    if (!childDoc.exists()) {
      console.warn(`Child document with ID ${childUid} not found, skipping.`)
      return
    }

    const parents = childDoc.data()?.parents || []

    // If only one parent exists (the one currently being deleted), delete the child
    if (parents.length <= 1 && parents.includes(currentParentId)) {
      console.log(`No other parents found for child ${childUid}, deleting child.`)
      await deleteUser({ id: childUid, ...childDoc.data() } as User)
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
