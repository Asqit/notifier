import { Router } from "@oak/oak";
import { authRoutes } from "./routes/auth.routes.ts";
import { userRoutes } from "./routes/users.routes.ts";

const router = new Router();

router.prefix("/api/v1");
router.use("/auth", authRoutes.routes(), authRoutes.allowedMethods());
router.use("/user", userRoutes.routes(), userRoutes.allowedMethods());

export default router;
