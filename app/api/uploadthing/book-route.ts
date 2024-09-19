import { createRouteHandler } from "uploadthing/next";
import { bookCoverRouter } from "./core";

// Routes for book cover uploads
export const { GET, POST } = createRouteHandler({
  router: bookCoverRouter,
});
