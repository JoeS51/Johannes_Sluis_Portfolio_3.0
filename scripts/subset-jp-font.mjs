// Builds app/_fonts/noto-sans-jp-{400,700}.woff2 holding only the characters the site uses.
// The full Noto Sans JP needs ~250 @font-face rules (189 KB of render-blocking CSS); this needs two.
// Re-run after adding new Japanese text: node scripts/subset-jp-font.mjs
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const roots = ["app", "content"];
const exts = /\.(tsx?|mdx?|css)$/;
const japanese = /[　-ヿ㐀-䶿一-鿿＀-￯]/gu;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (exts.test(entry.name)) yield path;
  }
}

const chars = new Set();
for (const root of roots) {
  for await (const file of walk(root)) {
    for (const c of (await readFile(file, "utf8")).match(japanese) ?? []) chars.add(c);
  }
}
// lang="ja" lines (post dates, reading time) also render Latin text in Noto.
for (let code = 0x20; code <= 0x7e; code++) chars.add(String.fromCharCode(code));
for (const c of "–—‘’“”…·") chars.add(c);

const text = [...chars].sort().join("");
const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

await mkdir("app/_fonts", { recursive: true });
for (const weight of [400, 700]) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`, { headers: { "User-Agent": ua } })).text();
  const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
  if (urls.length !== 1) throw new Error(`Expected one font file for weight ${weight}, got ${urls.length}`);
  const font = Buffer.from(await (await fetch(urls[0])).arrayBuffer());
  await writeFile(`app/_fonts/noto-sans-jp-${weight}.woff2`, font);
  console.log(`noto-sans-jp-${weight}.woff2: ${font.length} bytes`);
}
console.log(`${chars.size} characters`);
