import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        // 1. Check Admin from .env (Master access)
        if (email === process.env.ADMIN_EMAIL?.toLowerCase() && password === process.env.ADMIN_PASSWORD) {
          return { id: "admin", email: process.env.ADMIN_EMAIL, role: "ADMIN" };
        }

        // 2. Check Outreach Team from .env (Global Outreach access)
        if (email === process.env.OUTREACH_EMAIL?.toLowerCase() && password === process.env.OUTREACH_PASSWORD) {
          return { id: "team", email: process.env.OUTREACH_EMAIL, role: "OUTREACH" };
        }

        // 3. Check Firestore for individual Manager accounts
        try {
          const { getDb } = await import("@/lib/firebase-admin");
          const db = getDb();
          const userDoc = await db.collection("users").doc(email).get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData?.password === password) {
              return { 
                id: email, 
                email: email, 
                role: userData.role || "OUTREACH",
                name: userData.name 
              };
            }
          }
        } catch (error) {
          console.error("Auth Firestore Error:", error);
        }

        return null;
      },
    }),
  ],
});
