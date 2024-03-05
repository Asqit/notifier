"use strict";
import { Router } from "express";
import { transport, env } from "../utils.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "node:path";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const router = Router();
const ASSETS_PATH = join(__dirname, "..", "assets");

router.post("/random", async (req, res) => {
	try {
		const { passphrase } = req.body;
		const ENV_PASSPHRASE = env("PASSPHRASE");
		if (passphrase !== ENV_PASSPHRASE) {
			res.sendStatus(403);
			return;
		}

		const JSON_MESSAGES = readFileSync(join(ASSETS_PATH, "messages.json"));
		if (!JSON_MESSAGES) {
			res.status(500).json({
				message: "Internal Server Error",
				detail: "Server has failed to parse desired JSON file.",
			});
			return;
		}

		const messages = JSON_MESSAGES ? JSON.parse(JSON_MESSAGES)?.messages : [];
		if (messages.length === 0) {
			res.status(500).json({
				message: "Internal Server Error",
				detail: "Missing dependency",
			});
			return;
		}

		const message = messages[Math.floor(Math.random() * messages.length)];
		const emailTemplate = await ejs.renderFile(join(ASSETS_PATH, "templates/random.ejs"), {
			paragraph_1: message[0],
			paragraph_2: message[1],
			paragraph_3: message[2],
			signature: message[3],
		});

		await transport.sendMail({
			from: env("SMTP_USR"),
			to: env("RECEIVER"),
			subject: "Myslím na tebe",
			html: emailTemplate,
		});

		res.sendStatus(201);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: JSON.stringify(error),
		});
	}
});

// TODO: gain access to poetry API
router.post("/poetry", async (req, res) => {
	res.sendStatus(501);
});

// TODO: Finish this endpoint handler
router.post("/custom", async (req, res) => {
	try {
		const { message, title } = req.body;

		if (!message || !title) {
			res.sendStatus(404);
			return;
		}

		res.sendStatus(501);
	} catch (error) {
		res.status(500).json({
			message: "Internal Server Error",
			details: JSON.stringify(error),
		});
	}
});
