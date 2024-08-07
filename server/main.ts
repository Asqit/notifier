import { Application } from "@oak/oak";
import v1 from "./api/v1/index.ts";

const app = new Application();

app.use(v1.routes());
app.use(v1.allowedMethods());

app.addEventListener("listen", (e) => {
  const { hostname, port } = e;

  console.log(`Listening on http://${hostname}:${port}`);
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

app.listen({ port: 8000 });
