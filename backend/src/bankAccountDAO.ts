import { db } from "../../constants/firebaseConfig"
import { collection, query, where, getDoc, getDocs, doc, updateDoc, Timestamp, addDoc } from "firebase/firestore"
import { BankAccount } from "../types/bankAccount"

export async function createBankAccount(userUID: string) {
  const bankAccount: BankAccount = {
    UID: userUID,
    account_nr: "34989848484",
    account_type: "yDigBGdcMlS7h9pFKcqF",
    balance: 0,
    currency: "NOK",
    date_opened: Timestamp.now(),
    spending_limit: Number.MAX_SAFE_INTEGER,
  }

  try {
    await addDoc(collection(db, "bankAccounts"), bankAccount)
  } catch {
    throw new Error("Failed to create bank account")
  }
}

/**Funtion is used to get a bank account by its a users userID
 *
 * @param userUID A string of the id of the user.
 * @returns the id of the account and the account information
 */
export async function getBankAccountByUID(userUID: string): Promise<BankAccount & { id: string }> {
  try {
    const bankAccountsRef = collection(db, "bankAccounts")
    const q = query(bankAccountsRef, where("UID", "==", userUID))

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      throw new Error("Bank account not found")
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data() as BankAccount

    if (typeof data.balance !== "number") {
      throw new Error("Invalid or missing 'balance' field in bank account document")
    }

    return { id: doc.id, ...data }
  } catch (error) {
    throw new Error("Failed to get bank account by UID")
  }
}

/**
 * Function is used to adjust the balance of a bank account by a specified amount.
 *
 * @param accountId A string of the id of the account.
 * @param amount A number representing the amount to adjust the balance by (can be positive or negative).
 */
export async function adjustBalance(accountId: string, amount: number) {
  const accountDocRef = doc(db, "bankAccounts", accountId)
  try {
    // Retrieve the current balance
    const accountSnapshot = await getDoc(accountDocRef)
    if (!accountSnapshot.exists()) {
      throw new Error("Account not found")
    }
    // Get the current balance
    const currentBalance = accountSnapshot.data().balance
    // Calculate the new balance
    const newBalance = currentBalance + amount
    // Ensure the new balance is not negative
    if (newBalance < 0) {
      throw new Error("Insufficient funds for this operation")
    }
    // Update the document with the new balance
    await updateDoc(accountDocRef, { balance: newBalance })
  } catch (e) {
    throw new Error("Failed to adjust balance: " + e)
  }
}

export async function setSpendingLimit(childId: string, limit: number) {
  try {
    const childAccount = await getBankAccountByUID(childId)

    if (limit < 0) {
      throw new Error("Spending limit cannot be negative")
    }

    await updateDoc(doc(db, "bankAccounts", childAccount.id), { spending_limit: limit })
  } catch (error: any) {
    throw new Error("Failed to set spending limit: " + error.message)
  }
}

export async function getSpendingLimit(childId: string) {
  try {
    const childAccount = await getBankAccountByUID(childId)

    return childAccount.spending_limit
  } catch (error: any) {
    throw new Error("Failed to get spending limit: " + error.message)
  }
}
