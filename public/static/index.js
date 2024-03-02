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
	<header class="p-8 md:p-16 lg:p-32 bg-violet-700 text-white">
		<h1 class="text-4xl font-black">Notifier</h1>
		<h3 class="italic text-xl font-medium">Let your partner know you are thinking about them!</h3>
	</header>
	<main class="container mx-auto max-w-xl p-8">
		<form @submit="${handleNetworkCall}">
			${() =>
				networkData.isSuccess
					? html`<h2
							class="w-full bg-emerald-500 text-white font-black rounded-md outline outline-emerald-700 px-2 py-4 text-2xl my-4"
					  >
							Success!
					  </h2>`
					: ""}
			${() =>
				networkData.isLoading
					? html`<h2
							class="w-full bg-zinc-800 text-white font-black rounded-md outline outline-zinc-700 px-2 py-4 text-2xl my-4"
					  >
							Loading...
					  </h2>`
					: ""}
			${() =>
				networkData.isError
					? html` <div
							class="font-mono w-full bg-zinc-800 text-white font-black rounded-md outline outline-zinc-700 px-2 py-4 text-2xl my-4"
					  >
							<h2 class="font-black text-lg text-red-600">Error Occurred</h2>
							<p>${() => networkData.error}</p>
					  </div>`
					: ""}

			<div class="my-4">
				<label class="block font-medium text-xl" for="passphrase">Passphrase</label>
				<input
					type="text"
					id="passphrase"
					placeholder="secret..."
					class="w-full p-2 rounded-md text-lg text-black"
					@input="${(e) => (networkData.payload = e.target.value)}"
				/>
			</div>

			<button
				class="w-full mt-4 bg-violet-700 hover:bg-violet-800 active:bg-violet-900 px-4 py-2 rounded-md font-bold text-lg"
				type="submit"
			>
				notify!
			</button>
		</form>
	</main>
	<footer class="mt-16 p-8 md:p-16 rounded-md bg-slate-300 text-black container mx-auto max-w-xl">
		<p>Made with ♥ By Ondřej Tuček 🧑‍💻 ${new Date().getFullYear()}</p>
		<p>
			Like it? Issue?
			<a href="https://github.com/Asqit/notifier" style="text-decoration:underline" target="_blank">let me know</a>
		</p>
	</footer>
`;

window.addEventListener("load", () => {
	const root = document.getElementById("root");
	document.body.style["backgroundColor"] = "#000000";
	document.body.style["color"] = "#FFFFFF";
	app(root);
});
