import { z } from "zod"

export const FirestoreTimestampSchema = z.object({
    seconds: z.number(),
    nanoseconds: z.number(),
})

export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>