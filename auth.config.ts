import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/env.mjs";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /*Resend({
      apiKey: env.RESEND_API_KEY,         
      from: env.EMAIL_FROM,
      // sendVerificationRequest,
    }),*/
  ],

} satisfies NextAuthConfig;
