import { Router } from "express";
import { transport, emailTemplate, env } from "../utils.mjs";

export const router = Router();

router.post("/random", async (req, res) => {
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

// TODO: gain access to poetry API
router.post("/poetry", async (req, res) => {
	res.sendStatus(501);
});

// TODO: Add a way to POST custom messages
router.post("/custom", async (req, res) => {
	res.sendStatus(501);
});
