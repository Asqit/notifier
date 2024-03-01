"use strict";
import express from "express";
import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { env } from "./utils.mjs";
import { errorBoundary, notFound, reqLogger } from "./middlewares.mjs";
import cors from "cors";
import { router } from "./handlers/index.mjs";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const port = env("PORT");
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(reqLogger);
app.use("/", express.static(join(__dirname, "public")));
app.use("/", express.static("public"));
app.use(router);

app.use(notFound);
app.use(errorBoundary);

app.listen(port, () => {
	console.log(`The service is now available 🚀 \nlocally -> http://localhost:${port}`);
});
