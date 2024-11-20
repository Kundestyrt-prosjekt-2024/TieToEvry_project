import { db } from "../../constants/firebaseConfig"
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  onSnapshot,
} from "firebase/firestore"
import { BankAccount } from "../types/bankAccount"
import { useGetBankAccount } from "@/hooks/useGetFirestoreData"

/**
 * Creates a new bank account for a user.
 *
 * @param {string} userUID - The unique ID of the user.
 * @throws {Error} - If the bank account creation fails.
 */
export async function createBankAccount(userUID: string) {
  const bankAccount: BankAccount = {
    UID: userUID,
    account_nr: "34989848484",
    account_type: "yDigBGdcMlS7h9pFKcqF",
    balance: 2000,
    currency: "NOK",
    date_opened: Timestamp.now(),
    spending_limit: Number.MAX_SAFE_INTEGER,
    spending_limit_per_purchase: Number.MAX_SAFE_INTEGER,
  }

  try {
    await addDoc(collection(db, "bankAccounts"), bankAccount)
  } catch {
    throw new Error("Failed to create bank account")
  }
}

/**
 * Retrieves a bank account by its ID.
 *
 * @param {string} id - The ID of the bank account.
 * @returns {Promise<BankAccount>} - A promise that resolves to the bank account data.
 * @throws {Error} - If the bank account is not found or retrieval fails.
 */
export async function getBankAccount(id: string) {
  try {
    const accountDoc = await getDoc(doc(db, "bankAccounts", id))
    if (accountDoc.exists()) {
      return accountDoc.data() as BankAccount
    } else {
      throw new Error("Bank account not found")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

/**
 * Retrieves a bank account associated with a user ID and sets up a listener for updates.
 *
 * @param {string} userUID - The unique ID of the user.
 * @param {(updatedData: BankAccount) => void} [updateBankAccount] - Optional callback function to handle real-time updates to the bank account.
 * @returns {Promise<BankAccount & { id: string }>} - A promise that resolves to the bank account data and its ID.
 * @throws {Error} - If the bank account is not found or retrieval fails.
 */
export async function getBankAccountByUID(
  userUID: string,
  updateBankAccount?: (updatedData: BankAccount) => void
): Promise<BankAccount & { id: string }> {
  try {
    const bankAccountsRef = collection(db, "bankAccounts")
    const q = query(bankAccountsRef, where("UID", "==", userUID))

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      throw new Error("Bank account not found")
    }

    const docSnapshot = querySnapshot.docs[0]
    const data = docSnapshot.data() as BankAccount

    if (typeof data.balance !== "number") {
      throw new Error("Invalid or missing 'balance' field in bank account document")
    }

    const bankAccount = { id: docSnapshot.id, ...data }

    // Listener
    if (updateBankAccount) {
      const unsubscribe = onSnapshot(doc(db, "bankAccounts", bankAccount.id), (updatedDoc) => {
        if (updatedDoc.exists()) {
          const updatedData = updatedDoc.data() as BankAccount
          updateBankAccount(updatedData)
        }
      })
    }

    return bankAccount
  } catch (error) {
    throw new Error("Failed to get bank account by UID")
  }
}

/**
 * Adjusts the balance of a bank account by a specified amount.
 *
 * @param {string} accountId - The ID of the bank account.
 * @param {number} amount - The amount to adjust the balance by (can be positive or negative).
 * @throws {Error} - If the account is not found, the new balance is negative, or the update fails.
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

/**
 * Sets a spending limit for a child's bank account with a specific time limit.
 *
 * @param {string} childId - The unique ID of the child.
 * @param {number} limit - The spending limit amount.
 * @param {string} timeLimit - The time limit for the spending restriction (e.g., "daily", "weekly", "monthly").
 * @throws {Error} - If the limit is negative, the time limit is invalid, or the update fails.
 */
export async function setSpendingLimit(childId: string, limit: number, timeLimit: string) {
  try {
    const childAccount = await getBankAccountByUID(childId)

    if (limit < 0) {
      throw new Error("Spending limit cannot be negative")
    }

    const validTimeLimits = ["daily", "weekly", "monthly"]
    if (!validTimeLimits.includes(timeLimit)) {
      throw new Error("Invalid time limit. It must be one of: 'daily', 'weekly', 'monthly'")
    }

    await updateDoc(doc(db, "bankAccounts", childAccount.id), { spending_limit: limit, spending_time_limit: timeLimit })
  } catch (error: any) {
    throw new Error("Failed to set spending limit: " + error.message)
  }
}

/**
 * Sets a per-purchase spending limit for a child's bank account.
 *
 * @param {string} childId - The unique ID of the child.
 * @param {number} limit - The per-purchase spending limit amount.
 * @throws {Error} - If the limit is negative or the update fails.
 */
export async function setSpendingLimitPerPurchase(childId: string, limit: number) {
  try {
    const childAccount = await getBankAccountByUID(childId)

    if (limit < 0) {
      throw new Error("Spending limit cannot be negative")
    }

    await updateDoc(doc(db, "bankAccounts", childAccount.id), { spending_limit_per_purchase: limit })
  } catch (error: any) {
    throw new Error("Failed to set spending limit: " + error.message)
  }
}

/**
 * Retrieves the spending limit for a child's bank account.
 *
 * @param {string} childId - The unique ID of the child.
 * @returns {Promise<number>} - A promise that resolves to the spending limit.
 * @throws {Error} - If the retrieval fails.
 */
export async function getSpendingLimit(childId: string) {
  try {
    const childAccount = await getBankAccountByUID(childId)

    return childAccount.spending_limit
  } catch (error: any) {
    throw new Error("Failed to get spending limit: " + error.message)
  }
}

/**
 * Retrieves the per-purchase spending limit for a child's bank account.
 *
 * @param {string} childId - The unique ID of the child.
 * @returns {Promise<number>} - A promise that resolves to the per-purchase spending limit.
 * @throws {Error} - If the retrieval fails.
 */
export async function getSpendingLimitPerPurchase(childId: string) {
  try {
    const childAccount = await getBankAccountByUID(childId)

    return childAccount.spending_limit_per_purchase
  } catch (error: any) {
    throw new Error("Failed to get spending limit: " + error.message)
  }
}
