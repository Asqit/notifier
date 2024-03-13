"use strict";
import { reactive, html } from "https://esm.sh/@arrow-js/core";

const INITIAL_STATE = {
	isLoading: false,
	isError: false,
	isSuccess: false,
	error: undefined,
	payload: {
		title: "",
		message: "",
		signature: "",
		passphrase: "",
	},
};

export function CustomMessage() {
	const data = reactive({ ...INITIAL_STATE });

	const handleFormSubmission = async (e) => {
		try {
			e.preventDefault();
			data.isLoading = true;

			await fetch(`${location.protocol}//${location.host}/api/notify/random`, {
				headers: { "Content-Type": "application/json" },
				method: "POST",
				body: JSON.stringify(data.payload),
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

	return html`<form @submit="${handleFormSubmission}">
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
			<label for="title">Title</label>
			<input type="text" id="title" placeholder="title" @input="${(e) => (data.payload.title = e.target.value)}" />
		</div>

		<div>
			<label for="message">Message</label>
			<textarea
				type="text"
				id="message"
				placeholder="secret..."
				@input="${(e) => (data.payload.message = e.target.value)}"
			></textarea>
		</div>

		<div>
			<label for="signature">Signature</label>
			<input
				type="text"
				id="signature"
				placeholder="secret..."
				@input="${(e) => (data.payload.signature = e.target.value)}"
			/>
		</div>

		<div>
			<label for="passphrase">Passphrase</label>
			<input
				type="password"
				id="passphrase"
				placeholder="secret..."
				@input="${(e) => (data.payload.passphrase = e.target.value)}"
			/>
		</div>

		<button type="submit">notify!</button>
	</form>`;
}
