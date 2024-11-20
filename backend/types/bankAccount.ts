import { z } from "zod"
import { getSpendingLimit } from "../src/bankAccountDAO"

const FirestoreTimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
})

const BankAccountSchema = z.object({
  UID: z.string(),
  account_nr: z.string(),
  account_type: z.string(),
  balance: z.number(),
  currency: z.string(),
  date_opened: FirestoreTimestampSchema,
  spending_limit: z.number(),
  spending_time_limit: z.enum(["daily", "weekly", "monthly"]).optional(),
  spending_limit_per_purchase: z.number(),
})

export type BankAccount = z.infer<typeof BankAccountSchema>
export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>
