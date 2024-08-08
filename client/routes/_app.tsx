import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

// prettier-ignore
export default function App({ Component }: PageProps) {
  return (
    <html>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Poke</title>
        <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="manifest" href="/manifest.json" />
        <script type="module">
          import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate/dist/pwa-update.js';
          
          const el = document.createElement('pwa-update');
          document.body.appendChild(el);
        </script>
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
