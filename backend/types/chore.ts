import { z } from "zod"

const FirestoreTimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
})

const ChoreSchema = z.object({
  child_id: z.string(),
  parent_id: z.string(),
  chore_title: z.string(),
  chore_description: z.string(),
  icon: z.string(),
  chore_status: z.enum(["pending", "approved", "completed", "paid", "declined"]),
  created_at: FirestoreTimestampSchema,
  is_repeatable: z.boolean(),
  recurrence: z.enum(["daily", "weekly", "monthly"]),
  reward_amount: z.number(),
  time_limit: FirestoreTimestampSchema,
  id: z.string().optional(),
})

export type Chore = z.infer<typeof ChoreSchema>
export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>
