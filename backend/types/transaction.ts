import { z } from "zod";
import { FirestoreTimestampSchema } from "./firebase";

const TransactionSchema = z.object({
  id: z.string(),
  account_id_from: z.string(),
  account_id_to: z.string(),
  amount: z.number(),
  description: z.string(),
  type: z.string(),
  date: FirestoreTimestampSchema
})

const MoneyRequestSchema = z.object({
  id: z.string(),
  receiver: z.string(),
  sender: z.string(),
  message: z.string(),
  amount: z.number(),
  date: FirestoreTimestampSchema,
  status: z.enum(["pending", "accepted", "rejected"]),
})

export type MoneyRequest = z.infer<typeof MoneyRequestSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
