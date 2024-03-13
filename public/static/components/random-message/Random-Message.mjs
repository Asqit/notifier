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

	return html`<form @submit="${(e) => handleFormSubmission(e)}" class="max-w-2xl min-w-[480px]">
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
			<label for="passphrase" class="text-lg">Passphrase</label>
			<input
				class="p-2 text-xl rounded-md outline focus:outline-emerald-500 active:outline-emerald-500"
				type="text"
				id="passphrase"
				placeholder="secret..."
				@input="${(e) => (data.payload = e.target.value)}"
			/>
		</div>

		<button
			class="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 font-bold text-white rounded-md px-4 py-2 border-none text-lg"
			type="submit"
		>
			notify!
		</button>
	</form>`;
}
