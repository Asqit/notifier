import { Router } from "@oak/oak";

const userRoutes = new Router();

userRoutes.get("/", (ctx) => {
    ctx.response.body = "User endpoint";
});

export { userRoutes };