"use strict";
import express from "express";
import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { env, transport, emailTemplate } from "./utils.mjs";
import { errorBoundary, notFound, reqLogger } from "./middlewares.mjs";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const port = env("PORT");
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(reqLogger);

app.use("/", express.static(join(__dirname, "public")));
app.use("/", express.static("public"));
app.post("/notify", async (req, res) => {
	try {
		const { passphrase } = req.body;
		const ENV_PASSPHRASE = env("PASSPHRASE");

		if (passphrase !== ENV_PASSPHRASE) {
			res.sendStatus(403);
			return;
		}

		await transport.sendMail({
			from: env("SMTP_USR"),
			to: env("RECEIVER"),
			subject: "Myslím na tebe",
			html: emailTemplate(),
		});

		res.sendStatus(201);
	} catch (error) {
		res.status(500).json({
			message: "Internal Server Error",
			detail: JSON.stringify(error),
		});
	}
});

app.use(notFound);
app.use(errorBoundary);

app.listen(port, () => {
	console.log(`The service is now available 🚀 \nlocally -> http://localhost:${port}`);
});
