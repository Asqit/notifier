//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Notifier - FE
// FrontEnd for notifier service written in plain
// ol' JavaScript with Arrow.js library
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
"use strict";
import { CustomMessage, RandomMessage, Tabs } from "./components/index.mjs";
import { html } from "https://esm.sh/@arrow-js/core";

const app = html`
  <main class="p-8">
    <div class="container mx-auto max-w-3xl">
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
