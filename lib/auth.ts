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

// Resolve the site URL from explicit config first, then Vercel's own env vars.
// If none are set we leave it undefined so Better Auth infers it from the
// request — never fall back to localhost, which would reject production calls.
const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelUrl = process.env.VERCEL_URL;
const SITE_URL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProd ? `https://${vercelProd}` : undefined) ||
  (vercelUrl ? `https://${vercelUrl}` : undefined);

const trustedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  vercelProd ? `https://${vercelProd}` : undefined,
  vercelUrl ? `https://${vercelUrl}` : undefined,
].filter((u): u is string => Boolean(u));

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: SITE_URL,
  trustedOrigins,
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
