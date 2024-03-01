"use strict";
import { createTransport } from "nodemailer";
import { readFileSync } from "node:fs";
import { config } from "dotenv";
import { join } from "node:path";
import { __dirname } from "./index.mjs";

config();

/**
 * A function, which returns environmental variable if available
 * @param {string} key identifier in the process host
 * @throws {Error} generic error when the variable is not available
 * @returns the variable
 */
export function env(key) {
	const value = process.env[key];

	if (!value) {
		throw new Error(`Failed to obtain environmental variable: ${key}`);
	}

	return value;
}

/** Nodemailer transport object, used to send emails */
export const transport = createTransport({
	host: env("SMTP_HOST"),
	port: env("SMTP_PORT"),
	auth: {
		user: env("SMTP_USR"),
		pass: env("SMTP_PWD"),
	},
});

/**
 * A Function that will return an email template with random quotes
 * @returns the email template
 */
export const emailTemplate = () => {
	const loveMessages = JSON.parse(readFileSync(join(__dirname, "..", "public", "static", "messages.json")));

	if (!loveMessages) {
		throw new Error("Failed to parse JSON file");
	}

	const message = loveMessages?.messages[Math.floor(Math.random() * loveMessages.messages.length)];
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
