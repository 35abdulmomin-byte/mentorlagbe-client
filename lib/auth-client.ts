import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        plan: { type: "string" },
        phone: { type: "string" },
        bio: { type: "string" },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;