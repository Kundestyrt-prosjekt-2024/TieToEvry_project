import { db } from "@/constants/firebaseConfig"
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore"
import { User } from "../types/user"
import { getAuth } from "firebase/auth"

/**
 * Adds a new user to the database.
 *
 * @param {string} uid - The unique ID of the user.
 * @param {User} data - The user object containing user details.
 * @returns {Promise<string | undefined>} - A promise that resolves to the user ID if successful.
 * @throws {Error} - If adding the user fails.
 */
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

/**
 * Links a child user to a parent user and saves the child data to the database.
 *
 * @param {string} parentUid - The unique ID of the parent.
 * @param {string} childUid - The unique ID of the child.
 * @param {User} data - The user object containing child details.
 * @returns {Promise<string | undefined>} - A promise that resolves to the child ID if successful.
 * @throws {Error} - If linking the child to the parent fails.
 */
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

/**
 * Retrieves user data for a given UID and optionally sets up a listener for real-time updates.
 *
 * @param {string} uid - The unique ID of the user to retrieve.
 * @param {(updatedData: User) => void} [updateUserAccount] - Optional callback for real-time updates.
 * @returns {Promise<User | undefined>} - A promise that resolves to the user data if found.
 * @throws {Error} - If the user is not found or retrieval fails.
 */
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

/**
 * Updates the profile picture of a user.
 *
 * @param {string} uid - The unique ID of the user.
 * @param {string} url - The URL of the new profile picture.
 * @returns {Promise<void>} - A promise that resolves when the profile picture is updated.
 * @throws {Error} - If the update fails.
 */
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

/**
 * Retrieves the list of parent UIDs for a given user.
 *
 * @param {string} uid - The unique ID of the user.
 * @returns {Promise<string[]>} - A promise that resolves to an array of parent UIDs.
 * @throws {Error} - If fetching the parents fails.
 */
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
 * Adjusts the `sphareCoins` balance of a user by a specified amount.
 *
 * @param {string} uid - The unique ID of the user.
 * @param {number} amount - The amount to adjust the `sphareCoins` balance by (can be positive or negative).
 * @throws {Error} - If the user is not found or the operation fails.
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

/**
 * Deletes a user from the database, including removing references from parent accounts.
 *
 * @param {User} user - The user object containing the user details.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the user is deleted successfully.
 * @throws {Error} - If the user deletion fails.
 */
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

/**
 * Removes a child user from a parent's list of children.
 *
 * @param {string} parentUid - The unique ID of the parent.
 * @param {string} childUid - The unique ID of the child.
 * @returns {Promise<void>} - A promise that resolves when the child is removed.
 * @throws {Error} - If removing the child from the parent fails.
 */
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

/**
 * Deletes a child user if the current parent is their only parent.
 *
 * @param {string} childUid - The unique ID of the child.
 * @param {string} currentParentId - The unique ID of the current parent being removed.
 * @returns {Promise<void>} - A promise that resolves when the child is deleted or skipped.
 * @throws {Error} - If the operation fails.
 */
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
