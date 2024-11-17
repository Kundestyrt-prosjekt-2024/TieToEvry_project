import { z } from "zod"

const FirestoreTimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
})

const MoneyRequestSchema = z.object({
  id: z.string().optional(),
  receiver: z.string(),
  sender: z.string(),
  message: z.string(),
  amount: z.number(),
  date: FirestoreTimestampSchema,
  status: z.enum(["pending", "accepted", "rejected"]),
})

export type MoneyRequest = z.infer<typeof MoneyRequestSchema>
