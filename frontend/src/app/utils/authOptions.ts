import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/Log";
import { JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession, User, Account, Session } from "next-auth";

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      // Tipos explícitos para los callbacks
      async session({ session, token }: { session: Session; token: JWT }) {
        if (session.user) {
          session.user.id = token.sub as string; // Asegurarse de que "sub" sea una cadena
        }
        return session;
      },
      async signIn({ user, account }: { user: User; account: Account | null }) {
        try {
          await connectToDatabase();
  
          // Registrar el login en la base de datos
          const expiresIn = Number(account?.expires_in || 0); // Asegurar que es un número
          const expiration = new Date(Date.now() + expiresIn * 1000);
          const logEntry = new Log({
            email: user.email,
            expiration,
            token: account?.access_token,
          });
          await logEntry.save();
  
          return true;
        } catch (error) {
          console.error("Error al registrar el login:", error);
          return false;
        }
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };