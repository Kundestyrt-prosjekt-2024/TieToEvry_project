import { z } from "zod";

//The type as it is defined in Firestore
export const SavingGoalSchema = z.object({
  id: z.string().optional(),
  //account_id: z.string(),
  child_id: z.string(),
  current_amount: z.number(),
  goal_amount: z.number(),
  //Probably not the correct way to store an icon? Need to be better for later.
  icon_id: z.string(),
  title: z.string(),
});

export type SavingGoal = z.infer<typeof SavingGoalSchema>;
