import { db } from "@/constants/firebaseConfig"
import "firebase/firestore"
import { setDoc, doc, Firestore, getDoc } from "firebase/firestore"
import { User } from "../types/user"

class UserDAO {
  database: Firestore

  constructor() {
    this.database = db
  }

  async addUser(uid: string, data: User): Promise<string | undefined> {
    try {
      const docRef = doc(this.database, "users", uid)
      await setDoc(docRef, data)
      return uid
    } catch (error) {
      return undefined
    }
  }

  async getUser(uid: string): Promise<User | undefined> {
    try {
      const userDoc = await getDoc(doc(this.database, "users", uid))
      if (userDoc.exists()) {
        return userDoc.data() as User
      } else {
        return undefined
      }
    } catch (error) {
      return undefined
    }
  }
}

export default UserDAO
