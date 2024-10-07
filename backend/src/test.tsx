import { FormEvent } from "react"
import { db } from "../../constants/firebaseConfig"
import { collection, addDoc } from "firebase/firestore"

const handleSubmit = async (e: FormEvent) => {
  try {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    await addDoc(collection(db, "users"), data)
    form.reset()
  } catch (error) {
    console.error("Error adding document: ", error)
  }
}
