import { z } from "zod";

const ChoresSchema = z.object({
    icon: z.any(),
    chore: z.string().uuid(),
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    rewardNOK: z.number().min(0, "Reward must be a positive number"),
    rewardCoins: z.number().min(0, "Reward must be a positive number"),
    dueDate: z.date().refine(date => date > new Date(), "Due date must be in the future"),
    completed: z.boolean(),
    status: z.enum(["Gjennomførbar", "Forespurt", "Ferdig"]),
    assignee: z.string().nonempty("Assignee is required"),
});

export type Chore = z.infer<typeof ChoresSchema>;

export enum ChoreNavbarState {
    GJENNOMFØRT,
    FORESPURT,
    ELDRE
}