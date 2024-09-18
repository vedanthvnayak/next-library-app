import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { UserRepository } from "@/repository/user.repository";
import { DrizzleManager } from "@/db/drizzleDbConnection";

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const userRepository = new UserRepository(db);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          const user = await userRepository.findByEmail(email);
          if (!user) {
            console.error("User not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          return { id: user.userid, email: user.email, name: user.username };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userInDb = await userRepository.findByEmail(user.email);
        if (userInDb) {
          token.role = userInDb.role;
          token.userid = userInDb.userid;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
        session.user.id = token.userid;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
