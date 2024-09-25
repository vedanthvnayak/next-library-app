// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      calendlyUuid?: string; // Add calendlyUuid here
    };
  }

  interface User {
    calendlyUuid?: string; // Add calendlyUuid here as well
  }
}
