import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);
console.dir(handler);
export { handler as GET, handler as POST };
