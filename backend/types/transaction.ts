import { z } from "zod"

const FirestoreTimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
})

const TransactionSchema = z.object({
  account_id_from: z.string(),
  account_id_to: z.string(),
  amount: z.number(),
  description: z.string(),
  type: z.string(),
  date: FirestoreTimestampSchema,
})

export type Transaction = z.infer<typeof TransactionSchema>
