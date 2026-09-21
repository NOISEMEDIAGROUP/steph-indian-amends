import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const base = "/steph-indian-amends/";
const output = new URL("../pages-dist/", import.meta.url);

test("GitHub Pages can load the script that attaches the report's click handlers", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  const bootstrap = html.match(/<script\b[^>]*\bid="_R_"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(bootstrap, "The report must include its client bootstrap");

  const entry = bootstrap.match(/import\(["'`]([^"'`]+)["'`]\)/)?.[1];
  assert.ok(entry?.startsWith(`${base}assets/`), `Bootstrap must load from the Pages subdirectory: ${entry}`);
  await access(new URL(entry.slice(base.length), output));
  assert.match(html, /aria-label="Next panel"/);
  assert.match(html, /aria-label="Previous panel"/);
  assert.equal((html.match(/<!doctype html>/gi) ?? []).length, 1);
});

test("all exported asset references, including fonts and RSC payloads, resolve inside GitHub Pages", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  const assets = new Set(html.match(/\/(?:[\w.-]+\/)*assets\/[\w./-]+/g));
  assert.ok(assets.size > 0, "The exported report must reference compiled assets");

  for (const asset of assets) {
    assert.ok(asset.startsWith(base), `Asset would resolve outside the published report: ${asset}`);
    await access(new URL(asset.slice(base.length), output));
  }
});
