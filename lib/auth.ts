import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

// ─── Better Auth (admin authentication) ─────────────────────────────────────
// Email + password auth backed by the same Neon Postgres database the rest of
// the app uses. Sign-up is gated to a single allowed admin email, so there is
// no open registration — only that address can ever create an account, and it
// does so once to set its password.
//
// Required env:
//   DATABASE_URL          Neon connection string (use the -pooler endpoint)
//   BETTER_AUTH_SECRET    long random secret (openssl rand -base64 32)
//   NEXT_PUBLIC_SITE_URL  e.g. https://pathwaysofhope.org.au
//   ALLOWED_ADMIN_EMAIL   the only address allowed to register (defaults below)

const ALLOWED_ADMIN_EMAIL = (
  process.env.ALLOWED_ADMIN_EMAIL || "pathways_of_hope@outlook.com"
).toLowerCase();

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    // No email-verification step for a single internal admin account.
    requireEmailVerification: false,
  },
  databaseHooks: {
    user: {
      create: {
        // Reject any registration that isn't the approved admin address.
        before: async (user) => {
          if (user.email.toLowerCase() !== ALLOWED_ADMIN_EMAIL) {
            throw new Error("Registration is restricted to the charity administrator.");
          }
          return { data: user };
        },
      },
    },
  },
  // Must be last so Set-Cookie headers from sign-in/out are persisted in Next.
  plugins: [nextCookies()],
});
