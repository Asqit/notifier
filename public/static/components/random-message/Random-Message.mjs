"use strict";
import { reactive, html } from "https://esm.sh/@arrow-js/core";

const INITIAL_STATE = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: "",
  payload: "",
};

export function RandomMessage(isPoem = false) {
  const data = reactive({ ...INITIAL_STATE });

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    try {
      data.isLoading = true;
      data.isError = false;

      if (!data.payload) {
        throw new Error("Passphrase is required");
      }

      await fetch(
        `${location.protocol}//${location.host}/api/notify/${
          isPoem ? "poem" : "random"
        }`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ passphrase: data.payload }),
        }
      );

      data.isSuccess = true;
      data.isLoading = false;
    } catch (error) {
      data.error = error;
      data.isError = true;
    } finally {
      data.isLoading = false;
      e.reset();
    }
  };

  return html`<form @submit="${(e) => handleFormSubmission(e)}">
    ${() => {
      switch (true) {
        case data.isLoading:
          return html`<h2
            class="p-8 bg-zinc-500 text-white rounded-md outline outline-zinc-600 my-2 animate-pulse"
          >
            Loading...
          </h2>`;
        case data.isError:
          return html` <div
            class="p-8 bg-red-500 text-white rounded-md outline outline-red-600 my-2"
          >
            <h4>Error Occurred</h4>
            <p>${() => data.error}</p>
          </div>`;
        case data.isSuccess:
          return html`<h2
            class="p-8 bg-fuchsia-500 text-white rounded-md outline outline-fuchsia-600 my-2"
          >
            Success!
          </h2>`;
        default:
          return null;
      }
    }}

    <div class="flex flex-col gap-2 my-4">
      <label for="passphrase" class="text-lg">Passphrase</label>
      <input
        class="p-2 text-xl rounded-md outline focus:outline-fuchsia-500 active:outline-fuchsia-500"
        type="text"
        id="passphrase"
        placeholder="secret..."
        @input="${(e) => (data.payload = e.target.value)}"
      />
    </div>

    <button
      class="w-full bg-fuchsia-500 hover:bg-fuchsia-600 active:bg-fuchsia-700 font-bold text-white rounded-md px-4 py-2 border-none text-lg"
      type="submit"
    >
      notify!
    </button>
  </form>`;
}
