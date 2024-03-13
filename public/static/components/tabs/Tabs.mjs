import { reactive, html } from "https://esm.sh/@arrow-js/core";

/**
 * @typedef TabProps
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef TabsProps
 * @property {TabProps[]} tabs
 * @param {TabsProps} props
 * @returns
 */
export function Tabs(props) {
	const { tabs } = props;
	const state = reactive({
		tabs,
		selectedTab: 0,
	});

	return html`
		<div class="p-2 rounded-md bg-zinc-800 w-fit mx-auto">
			<!--HEADERS-->
			<div
				class="flex items-center justify-start gap-x-2 flex-wrap bg-zinc-700 p-1 outline outline-zinc-600 rounded-md mb-2"
			>
				${() =>
					state.tabs.map(
						(tab, index) => html`
							<button
								class="p-1 border-none cursor-pointer text-white ${state.selectedTab === index
									? "bg-zinc-500"
									: "bg-zinc-600"}"
								@click="${() => (state.selectedTab = index)}"
							>
								<p>${tab.title}</p>
							</button>
						`
					)}
			</div>

			<!--CONTENT-->
			<div class="bg-zinc-700 outline outline-zinc-600 mt-4 rounded-md p-2">
				${() => state.tabs[state.selectedTab].body}
			</div>
		</div>
	`;
}
