import { db } from "@/constants/firebaseConfig"
import "firebase/firestore"
import { addDoc, collection, doc, Firestore, getDoc, Timestamp } from "firebase/firestore"

export interface User {
  UserID: string
  created_at: Timestamp
  birthdate: Timestamp
  name: string
  passphrase: string
  phonenumber: number
}
class UserDAO {
  database: Firestore

  constructor() {
    this.database = db
  }

  addUser = async (data: User) => {
    try {
      await addDoc(collection(this.database, "users"), data)
    } catch (error) {
      console.error("Error adding document: ", error)
    }
  }

  getUser(phonenumber: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const userDoc = await getDoc(doc(this.database, "users", phonenumber))
        if (userDoc.exists()) {
          resolve(userDoc.data() as User)
        } else {
          reject(new Error("No such document!"))
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default UserDAO
