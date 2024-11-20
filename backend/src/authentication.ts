import { auth } from "../../constants/firebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth"
import { FirestoreTimestamp, User } from "../types/user"
import { Timestamp } from "firebase/firestore"
import { addChildToParent, addUser, getUser } from "./UserDAO"
import { createBankAccount } from "./bankAccountDAO"

/**
 * Registers a new user with the given credentials and details.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @param {string} name - The name of the user.
 * @param {number} phonenumber - The phone number of the user.
 * @param {FirestoreTimestamp} birthdate - The birthdate of the user as a Firestore timestamp.
 * @returns {Promise<string>} - A promise that resolves to the user ID of the newly registered user.
 * @throws {Error} - If an error occurs during user registration.
 */
const registerUser = async (
  email: string,
  password: string,
  name: string,
  phonenumber: number,
  birthdate: FirestoreTimestamp
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const newUser: User = {
      created_at: Timestamp.now(),
      birthdate: birthdate,
      name: name,
      phonenumber: phonenumber,
      children: [],
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/mobile-banking-app-dacb3.appspot.com/o/Profile%20Pictures%2FDefault_pfp.png?alt=media&token=3c5ea107-33ee-4b7b-8df6-4ab8b3522aaa",
      sphareCoins: 500,
    }

    const userId = await addUser(user.uid, newUser)
    await createBankAccount(user.uid)
    return userId
  } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * Registers a new child user under an existing parent account.
 *
 * @param {string} email - The email address of the child.
 * @param {string} password - The password for the child's user account.
 * @param {string} name - The name of the child.
 * @param {number} phonenumber - The phone number of the child.
 * @param {FirestoreTimestamp} birthdate - The birthdate of the child as a Firestore timestamp.
 * @param {string} parentUid - The UID of the parent user.
 * @returns {Promise<string>} - A promise that resolves to the user ID of the newly registered child.
 * @throws {Error} - If an error occurs during child registration.
 */
const registerChild = async (
  email: string,
  password: string,
  name: string,
  phonenumber: number,
  birthdate: FirestoreTimestamp,
  parentUid: string
) => {
  try {
    const childCredential = await createUserWithEmailAndPassword(auth, email, password)
    const child = childCredential.user

    const newUser: User = {
      created_at: Timestamp.now(),
      birthdate: birthdate,
      name: name,
      phonenumber: phonenumber,
      children: [],
      parents: [parentUid],
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/mobile-banking-app-dacb3.appspot.com/o/Profile%20Pictures%2FDefault_pfp.png?alt=media&token=3c5ea107-33ee-4b7b-8df6-4ab8b3522aaa",
      sphareCoins: 500,
    }

    const userId = await addChildToParent(parentUid, child.uid, newUser)
    await createBankAccount(child.uid)
    return userId
  } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * Logs in an existing user with the given email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<string>} - A promise that resolves to the UID of the logged-in user.
 * @throws {Error} - If an error occurs during login.
 */
const loginUser = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    getUser(userCredential.user.uid)
    return userCredential.user.uid
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export { registerUser, loginUser, registerChild }
