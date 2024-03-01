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

const handleNetworkCall = async (e) => {
	e.preventDefault();
	networkData.isLoading = true;
	try {
		if (!networkData.payload) {
			throw new Error("Invalid Passphrase!");
		}

		const response = await fetch(`http://${location.host.split(":")[0]}:8080/notify`, {
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
};

const app = html`
	<header>
		<h1>Notifier</h1>
		<h3>Let your partner know you are thinking about them!</h3>
	</header>
	<main>
		<div class="error-boundary">
			<h2>${() => (networkData.isError ? "Error Occurred" : "")}</h2>
			<p>${() => networkData.error}</p>
		</div>
		<form @submit="${handleNetworkCall}">
			${() => (networkData.isSuccess ? "<h2 class='alert success'>Success!</h2>" : "")}
			${() => (networkData.isLoading ? "<h2 class='alert'>Loading...</h2>" : "")}

			<label for="passphrase">Passphrase</label>
			<input type="text" id="passphrase" @input="${(e) => (networkData.payload = e.target.value)}" />

			<button type="submit">notify!</button>
		</form>
	</main>
`;

window.addEventListener("load", () => {
	const root = document.getElementById("root");
	app(root);
});
