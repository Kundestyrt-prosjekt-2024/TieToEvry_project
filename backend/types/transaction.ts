import { z } from "zod";

const FirestoreTimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
});

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
  requestedAt: FirestoreTimestampSchema,
  status: z.enum(["pending", "accepted", "rejected", "cancelled"]),
})

export type MoneyRequest = z.infer<typeof MoneyRequestSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
