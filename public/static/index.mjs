//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Notifier - FE
// FrontEnd for notifier service written in plain
// ol' JavaScript with Arrow.js library
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
"use strict";
import { html } from "https://esm.sh/@arrow-js/core";
import { CustomMessage, RandomMessage, Tabs } from "./components/index.mjs";

const app = html`
	<main class="p-16">
		<div class="container mx-auto max-w-7xl">
			${Tabs({
				tabs: [
					{
						title: "Random Message",
						body: RandomMessage(),
					},
					{
						title: "Custom Message",
						body: CustomMessage(),
					},
					{
						title: "Random Poem",
						body: RandomMessage(true),
					},
				],
			})}
		</div>
	</main>
`;

window.addEventListener("load", () => {
	const root = document.getElementById("root");
	app(root);
});

window.addEventListener("unload", () => {
	document.removeChild(document.getElementById("root"));
	app = null;
});
