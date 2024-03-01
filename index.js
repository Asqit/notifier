"use strict";
import nodemailer from "nodemailer";
import express from "express";
import { config } from "dotenv";
import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

function env(key) {
	const value = process.env[key];

	if (!value) {
		throw new Error(`Failed to obtain environmental variable: ${key}`);
	}

	return value;
}

const transport = nodemailer.createTransport({
	host: env("SMTP_HOST"),
	port: env("SMTP_PORT"),
	auth: {
		user: env("SMTP_USR"),
		pass: env("SMTP_PWD"),
	},
});

const loveMessages = [
	[
		"Každý okamžik s tebou je pro mě jako vysněný sen.",
		"Doufám, že tvůj den je plný radosti a lásky!",
		"S nekonečnou láskou,",
		"Tvůj pán Vondřej 💞",
	],
	[
		"Tvá přítomnost ve mém životě mě naplňuje štěstím a láskou.",
		"Přeji ti den, který bude stejně nádherný jako ty jsi pro mě!",
		"S láskou a něžností,",
		"Tvůj pán Vondřej 😊",
	],
	[
		"Tvá úsměv mě rozjasňuje každý den a tvá láska mě naplňuje radostí.",
		"Přeji ti den plný lásky, smíchu a štěstí!",
		"S nekonečnou náklonností,",
		"Tvůj pán Vondřej 💖",
	],
	[
		"Tvá přítomnost ve mně vyvolává pocit klidu a radosti.",
		"Přeji ti, aby tvůj den byl plný úsměvů a štěstí!",
		"S láskou a něhou,",
		"Tvá láska 💖",
	],
	[
		"Můj svět je jasnější a pohodlnější s tebou u mé strany.",
		"Doufám, že tvůj den je stejně úžasný jako ty sáma!",
		"S nekonečnou náklonností,",
		"Tvoje oddaná polovička 😊",
	],
	[
		"Když jsem s tebou, cítím se jako doma.",
		"Přeji ti radostné a láskyplné okamžiky během dne!",
		"S láskou a objetím,",
		"Tvůj parťák 🤗",
	],
	[
		"Tvá blízkost mě naplňuje štěstím a klidem.",
		"Přeji ti, aby tvůj den byl jako pohádka plná štěstí a lásky!",
		"Srdce mi zaplesá, když jen pomyslím na tebe.",
		"S láskou a úctou, Tvůj milovaný 🌹",
	],
];

/**
 * A Function that will return an email template with random quotes
 * @returns the email template
 */
export const emailTemplate = () => {
	const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];

	return `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Myslím na tebe</title>
		</head>
		<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px">
			<table width="100%" cellspacing="0" cellpadding="0" border="0">
				<tr>
					<td align="center">
						<table
							width="600"
							cellspacing="0"
							cellpadding="0"
							border="0"
							style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1)"
						>
							<tr>
								<td style="padding: 20px">
									<h1 style="color: #333333; text-align: center">Milá Míšo</h1>
									<p style="color: #666666">${message[0]}</p>
									<p style="color: #666666">${message[1]}</p>
									<p style="color: #666666">${message[2]}</p>
									<p style="color: #333333; font-weight: bold">${message[3]}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>
	</html>
	`;
};

const port = env("PORT");
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
	} catch (error) {
		res.sendStatus(500).json({
			message: "Internal Server Error",
			detail: JSON.stringify(error),
		});
	}
});

app.listen(port, () => {
	console.log(`The service is now available at :${port}`);
});
