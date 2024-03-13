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

	return html`<form @submit="${handleFormSubmission}" class="max-w-2xl min-w-[480px]">
		${() =>
			data.isSuccess
				? html`<h2 class="p-8 bg-emerald-500 text-white rounded-md outline outline-emerald-600 my-2">Success!</h2>`
				: ""}
		${() =>
			data.isLoading
				? html`<h2 class="p-8 bg-zinc-500 text-white rounded-md outline outline-zinc-600 my-2">Loading...</h2>`
				: ""}
		${() =>
			data.isError
				? html` <div class="p-8 bg-red-500 text-white rounded-md outline outline-red-600 my-2">
						<h4>Error Occurred</h4>
						<p>${() => data.error}</p>
				  </div>`
				: ""}
		<div class="flex flex-col gap-2 my-4">
			<label for="title">Title</label>
			<input
				type="text"
				id="title"
				placeholder="title"
				class="p-2 text-xl rounded-md outline focus:outline-emerald-500 active:outline-emerald-500"
				@input="${(e) => (data.payload.title = e.target.value)}"
			/>
		</div>

		<div class="flex flex-col gap-2 my-4">
			<label for="signature">Signature</label>
			<input
				type="text"
				id="signature"
				placeholder="secret..."
				class="p-2 text-xl rounded-md outline focus:outline-emerald-500 active:outline-emerald-500"
				@input="${(e) => (data.payload.signature = e.target.value)}"
			/>
		</div>

		<div class="flex flex-col gap-2 my-4">
			<label for="passphrase">Passphrase</label>
			<input
				type="password"
				id="passphrase"
				placeholder="secret..."
				class="p-2 text-xl rounded-md outline focus:outline-emerald-500 active:outline-emerald-500"
				@input="${(e) => (data.payload.passphrase = e.target.value)}"
			/>
		</div>

		<div class="flex flex-col gap-2 my-4">
			<label for="message">Message</label>
			<textarea
				type="text"
				id="message"
				placeholder="secret..."
				class="p-2 text-xl rounded-md outline focus:outline-emerald-500 active:outline-emerald-500 resize-y"
				@input="${(e) => (data.payload.message = e.target.value)}"
			></textarea>
		</div>

		<button
			class="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 font-bold text-white rounded-md px-4 py-2 border-none text-lg"
			type="submit"
		>
			notify!
		</button>
	</form>`;
}
