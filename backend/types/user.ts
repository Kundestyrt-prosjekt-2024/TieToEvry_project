import { z } from "zod";

const FirestoreTimestampSchema = z.object({
    seconds: z.number(),
    nanoseconds: z.number(),
});

const UserSchema = z.object({
    uid: z.string(),
    created_at: FirestoreTimestampSchema,
    birthdate: FirestoreTimestampSchema,
    name: z.string(),
    phonenumber: z.number(),
    children: z.array(z.string()).optional(),
    parents: z.array(z.string()).optional(),
    profilePicture: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>;
