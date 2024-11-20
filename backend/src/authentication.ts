import { auth } from "../../constants/firebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth"
import { FirestoreTimestamp, User } from "../types/user"
import { Timestamp } from "firebase/firestore"
import { addChildToParent, addUser, getUser } from "./UserDAO"
import { createBankAccount } from "./bankAccountDAO"

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
