import { z } from "zod"
import { FirestoreTimestampSchema } from "./firebase"

const ChoreSchema = z.object({
  child_id: z.string(),
  parent_id: z.string(),
  chore_title: z.string(),
  chore_description: z.string(),
  icon: z.string(),
  chore_status: z.enum(["available", "pending", "complete", "rejected"]),
  created_at: FirestoreTimestampSchema,
  is_repeatable: z.boolean(),
  recurrence: z.enum(["daily", "weekly", "monthly"]),
  reward_amount: z.number(),
  paid: z.boolean(),
  time_limit: FirestoreTimestampSchema,
  id: z.string().optional(),
})

export type Chore = z.infer<typeof ChoreSchema>