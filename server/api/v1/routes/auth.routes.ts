import { Router } from "@oak/oak";

const authRoutes = new Router();

authRoutes.get("/login", (ctx) => {
  ctx.response.body = "Login endpoint";
});

export { authRoutes };
