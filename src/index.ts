import { serve } from "bun";
import index from "./index.html";
import { router } from "./configs/route.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./configs/query.config";
import { RouterProvider } from "react-router-dom";

const server = serve({
  routes: {
    "/*": index,
    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },
    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
