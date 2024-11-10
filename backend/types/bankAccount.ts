import { z } from "zod";

const FirestoreTimestampSchema = z.object({
    seconds: z.number(),
    nanoseconds: z.number(),
});

const BankAccountSchema = z.object({
    UID: z.string(),
    account_nr: z.string(),
    account_type: z.string(),
    balance: z.number(),
    currency: z.string(),
    date_opened: FirestoreTimestampSchema,
});

export type BankAccount = z.infer<typeof BankAccountSchema>;
export type FirestoreTimestamp = z.infer<typeof FirestoreTimestampSchema>;
