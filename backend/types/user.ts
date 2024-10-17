import { z } from "zod";

const UserSchema = z.object({
    created_at: z.date(),
    birthdate: z.date(),
    name: z.string(),
    passphrase: z.string(),
    phonenumber: z.number(),
});

export type User = z.infer<typeof UserSchema>;
