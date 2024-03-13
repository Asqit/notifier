"use strict";
import { reactive, html } from "https://esm.sh/@arrow-js/core";

const INITIAL_STATE = {
	isLoading: false,
	isError: false,
	isSuccess: false,
	error: "",
	payload: "",
};

export function RandomMessage() {
	const data = reactive({ ...INITIAL_STATE });

	const handleFormSubmission = async (e) => {
		e.preventDefault();
		try {
			data.isLoading = true;

			if (!data.payload) {
				data.isError = true;
				data.error = "Cannot send empty passphrase!";
				return;
			}

			await fetch(`${location.protocol}//${location.host}/api/notify/random`, {
				headers: { "Content-Type": "application/json" },
				method: "POST",
				body: JSON.stringify({ passphrase: data.payload }),
			});

			data.isSuccess = true;
			data.isLoading = false;
		} catch (error) {
			data.error = JSON.stringify(error);
			data.isError = true;
		} finally {
			data.isLoading = false;
		}
	};

	return html`<form @submit="${(e) => handleFormSubmission(e)}">
		${() => (data.isSuccess ? html`<h2 class="alert success">Success!</h2>` : "")}
		${() => (data.isLoading ? html`<h2 class="alert warning">Loading...</h2>` : "")}
		${() =>
			data.isError
				? html` <div class="alert danger">
						<h4>Error Occurred</h4>
						<p>${() => data.error}</p>
				  </div>`
				: ""}

		<div>
			<label for="passphrase">Passphrase</label>
			<input type="text" id="passphrase" placeholder="secret..." @input="${(e) => (data.payload = e.target.value)}" />
		</div>

		<button type="submit">notify!</button>
	</form>`;
}
