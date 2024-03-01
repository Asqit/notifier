//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Notifier - FE
// FrontEnd for notifier service written in plain
// ol' JavaScript with Arrow.js library
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
"use strict";
import { reactive, html } from "https://esm.sh/@arrow-js/core";

const networkData = reactive({
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: undefined,
	response: undefined,
	payload: "",
});

async function handleNetworkCall(e) {
	e.preventDefault();

	networkData.isLoading = true;
	networkData.isSuccess = false;
	networkData.isError = false;

	try {
		if (!networkData.payload) {
			throw new Error("Invalid Passphrase!");
		}

		const response = await fetch(`http://${location.host}/api/notify/random`, {
			headers: { "Content-Type": "application/json" },
			method: "POST",
			body: JSON.stringify({ passphrase: networkData.payload }),
		});

		if (response.status !== 201) {
			networkData.isError = true;
			networkData.error = JSON.stringify(response.statusText);
			return;
		}

		networkData.isSuccess = true;
	} catch (error) {
		networkData.isError = true;
		networkData.error = error?.message ? error.message : JSON.stringify(error);
	} finally {
		networkData.isLoading = false;
	}
}

const app = html`
	<header>
		<h1>Notifier</h1>
		<h3>Let your partner know you are thinking about them!</h3>
	</header>
	<main>
		<form @submit="${handleNetworkCall}">
			${() => (networkData.isSuccess ? html`<h2 class="alert success">Success!</h2>` : "")}
			${() => (networkData.isLoading ? html`<h2 class="alert">Loading...</h2>` : "")}
			${() =>
				networkData.isError
					? html` <div class="error-boundary alert">
							<h2>Error Occurred</h2>
							<p>${() => networkData.error}</p>
					  </div>`
					: ""}

			<label for="passphrase">Passphrase</label>
			<input
				type="text"
				id="passphrase"
				placeholder="secret..."
				@input="${(e) => (networkData.payload = e.target.value)}"
			/>

			<button type="submit">notify!</button>
		</form>
	</main>
	<footer
		style="background-color:#d0d0d0;color:black;padding:4rem;border-radius:0.5rem;text-align:center;max-width: 768px;margin-inline:auto;"
	>
		<p>Made with ♥ By Ondřej Tuček 🧑‍💻 ${new Date().getFullYear()}</p>
		<p>
			Like it? Issue?
			<a href="https://github.com/Asqit/notifier" style="text-decoration:underline" target="_blank">let me know</a>
		</p>
	</footer>
`;

window.addEventListener("load", () => {
	const root = document.getElementById("root");
	app(root);
});
