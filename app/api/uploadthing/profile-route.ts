import { createRouteHandler } from "uploadthing/next";
import { profileImageRouter } from "./core";

// Routes for profile image uploads
export const { GET, POST } = createRouteHandler({
  router: profileImageRouter,
});
