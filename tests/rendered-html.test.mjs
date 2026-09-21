import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the restructured Indian Motorcycle story", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const text of ["Indian Motorcycle","This month in 3 points","Next month priority","Less spend delivered stronger efficiency","Lead delivery beat plan without overspending","Google did more with less as CPA fell 17%","Top performers","Low performers","KEEP","IMPROVE","TEST","What happens next"] ) assert.match(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  assert.match(html, /aria-label="Performance report"/);
  assert.match(html, /aria-label="Report page navigation"/);
  assert.equal((html.match(/data-story-panel="true"/g) ?? []).length, 18);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps public image paths compatible with the GitHub Pages subdirectory", async () => {
  const [pageSource, workflow] = await Promise.all([readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8")]);
  assert.match(pageSource, /NEXT_PUBLIC_REPORT_BASE_PATH/);
  assert.match(pageSource, /reportAsset\("noise-logo-black\.png"\)/);
  assert.match(pageSource, /reportAsset\("indian-creative-triptych\.png"\)/);
  assert.match(workflow, /NEXT_PUBLIC_REPORT_BASE_PATH: \/steph-indian-amends/);
});
