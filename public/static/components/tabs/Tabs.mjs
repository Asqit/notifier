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
		<div>
			<!--HEADERS-->
			<div>
				${() =>
					state.tabs.map(
						(tab, index) => html`
							<button @click="${() => (state.selectedTab = index)}">
								<p>${tab.title}</p>
							</button>
						`
					)}
			</div>

			<!--CONTENT-->
			<div>${() => state.tabs[state.selectedTab].body}</div>
		</div>
	`;
}
