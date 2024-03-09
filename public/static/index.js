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

		const response = await fetch(`${location.protocol}//${location.host}/api/notify/random`, {
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
	<main>
		<div class="container">
			<form @submit="${handleNetworkCall}">
				${() => (networkData.isSuccess ? html`<h2 class="alert success">Success!</h2>` : "")}
				${() => (networkData.isLoading ? html`<h2 class="alert warning">Loading...</h2>` : "")}
				${() =>
					networkData.isError
						? html` <div class="alert danger">
								<h4>Error Occurred</h4>
								<p>${() => networkData.error}</p>
						  </div>`
						: ""}

				<div>
					<label for="passphrase">Passphrase</label>
					<input
						type="text"
						id="passphrase"
						placeholder="secret..."
						@input="${(e) => (networkData.payload = e.target.value)}"
					/>
				</div>

				<button type="submit">notify!</button>
			</form>
		</div>
	</main>
`;

window.addEventListener("load", () => {
	const root = document.getElementById("root");
	app(root);
});
