import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { UserRepository } from "@/repository/user.repository";
import { DrizzleManager } from "@/db/drizzleDbConnection";

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = await getServerSession(authOptions);

  // Check if session exists and contains the email
  if (!session || !session.user?.email) {
    throw new UploadThingError("Unauthorized");
  }

  return { email: session.user.email };
};

// FileRouter for your app
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // Return the email as metadata for later use
      return { email: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after the upload
      // console.log("Upload complete for email:", metadata.email);
      // console.log("File URL:", file.url);

      // Return the email to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.email, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
