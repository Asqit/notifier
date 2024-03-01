import express from "express";

/**
 * An express middleware for reporting all HTTP requests and their responses
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function reqLogger(req, res, next) {
	try {
		const { method, url } = req;
		const ip = req.socket.remoteAddress;
		const syntax = `Method - [${method.toUpperCase()}], URL - [${url}], IP - [${ip}]`;

		console.log(syntax);

		res.on("finish", () => {
			const { statusCode } = res;
			console.log(syntax.concat(`, HTTP_CODE: [${statusCode}]`));
		});

		next();
	} catch (error) {
		console.error(error);
		next();
	}
}

/**
 * An express middleware for handling not found
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function notFound(req, res, next) {
	res.sendStatus(404);
}

/**
 * An express middleware for handling errors
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function errorBoundary(err, req, res, next) {
	console.error(err);
	res.status(500).json({ message: "Internal Server Error" });
}
