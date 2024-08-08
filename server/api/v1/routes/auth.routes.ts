import { Router } from "@oak/oak";

const authRoutes = new Router();

authRoutes.post("/login", (ctx) => {
  ctx.response.body = "Login endpoint";
});

authRoutes.post("/register", (ctx) => {
  ctx.response.body = "Register endpoint";
});

authRoutes.put("/refresh", (ctx) => {
  ctx.response.body = "Refresh endpoint";
});

export { authRoutes };
