import { z } from "zod"
import { FirestoreTimestampSchema } from "./firebase"

const MoneyRequestSchema = z.object({
  id: z.string().optional(),
  receiver: z.string(),
  sender: z.string(),
  message: z.string(),
  amount: z.number(),
  date: FirestoreTimestampSchema,
  status: z.enum(["pending", "accepted", "rejected"]),
})

const AllowanceSchema = z.object({
  childId: z.string().optional(),
  recurrence: z.number(),
  day: z.number(),
  amount: z.number(),
  message: z.string(),
  date: FirestoreTimestampSchema,
})

export type MoneyRequest = z.infer<typeof MoneyRequestSchema>
export type Allowance = z.infer<typeof AllowanceSchema>