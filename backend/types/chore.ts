import { z } from "zod"

const FirestoreTimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
})

const ChoreSchema = z.object({
  child_id: z.string(),
  parent_id: z.string(),
  chore_description: z.string(),
  icon: z.string(),
  chore_status: z.string(),
  created_at: FirestoreTimestampSchema,
  is_repeatable: z.boolean(),
  recurrence: z.enum(["daily", "weekly", "monthly"]),
  reward_amount: z.number(),
  time_limit: FirestoreTimestampSchema,
})

export type Chore = z.infer<typeof ChoreSchema>
export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>
