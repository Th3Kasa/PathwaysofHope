import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";

// Register the Better Auth component. It manages its own user/session/account
// tables inside Convex; our application tables live in schema.ts.
const app = defineApp();
app.use(betterAuth);

export default app;
