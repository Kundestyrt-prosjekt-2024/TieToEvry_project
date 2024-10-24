import { z } from "zod";

const UserSchema = z.object({
    created_at: z.date(),
    birthdate: z.date(),
    name: z.string(),
    passphrase: z.string(),
    phonenumber: z.number(),
    children: z.array(z.string()).optional(),
    parents: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;
