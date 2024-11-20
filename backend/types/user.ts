import { z } from "zod"
import { FirestoreTimestampSchema } from "./firebase"

const UserSchema = z.object({
  created_at: FirestoreTimestampSchema,
  birthdate: FirestoreTimestampSchema,
  name: z.string(),
  phonenumber: z.number(),
  children: z.array(z.string()).optional(),
  parents: z.array(z.string()).optional(),
  profilePicture: z.string(),
  sphareCoins: z.number(),
  id: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
