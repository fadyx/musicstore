import { User } from "@/types";

export type PublicUser = Omit<User, "password">;
