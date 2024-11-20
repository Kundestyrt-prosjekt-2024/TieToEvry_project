import { z } from "zod"
import { FirestoreTimestampSchema } from "./firebase"

const TransactionSchema = z.object({
  account_id_from: z.string(),
  account_id_to: z.string(),
  amount: z.number(),
  description: z.string(),
  type: z.string(),
  date: FirestoreTimestampSchema,
})

export type Transaction = z.infer<typeof TransactionSchema>
