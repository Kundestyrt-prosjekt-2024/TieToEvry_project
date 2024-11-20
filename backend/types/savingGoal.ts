import { z } from "zod"

export const SavingGoalSchema = z.object({
  id: z.string().optional(),
  child_id: z.string(),
  current_amount: z.number(),
  goal_amount: z.number(),
  icon_id: z.string(),
  title: z.string(),
  complete: z.boolean().default(false),
})

export type SavingGoal = z.infer<typeof SavingGoalSchema>
