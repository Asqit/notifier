"use strict";

async function handleNotificationCall() {
	try {
		const value = document.getElementById("password").value;
		await fetch("http://localhost:8080/notify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				passphrase: value,
			}),
		});
	} catch (error) {
		console.error(error);
	}
}

function main() {
	const form = document.getElementById("submit");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		handleNotificationCall();
	});
}

window.addEventListener("load", main);
