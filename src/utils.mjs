"use strict";
import { createTransport } from "nodemailer";
import { config } from "dotenv";
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
