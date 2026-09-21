import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const out = path.join(projectRoot, "pages-dist");
const base = "/steph-indian-amends/";

await mkdir(out, { recursive: true });
await cp(path.join(projectRoot, "dist", "client"), out, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request(new URL(base, "http://localhost"), { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static render failed: ${response.status}`);
// Vinext's inline next/font CSS still uses root-relative font URLs even when
// basePath is set. Keep those URLs under the same prefix as the compiled assets.
const html = (await response.text()).replaceAll(
  /(?<![\w/-])\/assets\/_vinext_fonts\//g,
  `${base}assets/_vinext_fonts/`,
);
await writeFile(path.join(out, "index.html"), html, "utf8");
