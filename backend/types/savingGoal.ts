import { z } from "zod";

//The type as it is defined in Firestore
export const SavingGoalSchema = z.object({
  // This field is optional because we want to use this schema for both creating and updating saving goals.
  // We should look at creating different schemas for these two operations as this is better practice.
  id: z.string().optional(),
  //account_id: z.string(),
  child_id: z.string(),
  current_amount: z.number(),
  goal_amount: z.number(),
  icon_id: z.string(),
  title: z.string(),
  complete: z.boolean().default(false),
});

export type SavingGoal = z.infer<typeof SavingGoalSchema>;
