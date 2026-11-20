/* 用 chromium 把 Cloudflare 云朵 mark 渲染成 Android 各密度图标：
   legacy ic_launcher(_round) 48/72/96/144/192，adaptive foreground/background 108/162/216/324/432。 */
import { createRequire } from "node:module";
const require2 = createRequire("/data/next/test/");
const puppeteer = require2("puppeteer-core");
import { mkdirSync, writeFileSync } from "node:fs";

const CLOUD = `<path fill="#f48120" d="M88.1 24c.3-1 .2-2-.3-2.6-.5-.6-1.2-1-2.1-1.1l-17.4-.2c-.1 0-.2-.1-.3-.1-.1-.1-.1-.2 0-.3.1-.2.2-.3.4-.3l17.5-.2c2.1-.1 4.3-1.8 5.1-3.8l1-2.6c0-.1.1-.2 0-.3-1.1-5.1-5.7-8.9-11.1-8.9-5 0-9.3 3.2-10.8 7.7-1-.7-2.2-1.1-3.6-1-2.4.2-4.3 2.2-4.6 4.6-.1.6 0 1.2.1 1.8-3.9.1-7.1 3.3-7.1 7.3 0 .4 0 .7.1 1.1 0 .2.2.3.3.3h32.1c.2 0 .4-.1.4-.3l.3-1.1z"/>
<path fill="#faad3f" d="M93.6 12.8h-.5c-.1 0-.2.1-.3.2l-.7 2.4c-.3 1-.2 2 .3 2.6.5.6 1.2 1 2.1 1.1l3.7.2c.1 0 .2.1.3.1.1.1.1.2 0 .3-.1.2-.2.3-.4.3l-3.8.2c-2.1.1-4.3 1.8-5.1 3.8l-.2.9c-.1.1 0 .3.2.3h13.2c.2 0 .3-.1.3-.3.2-.8.4-1.7.4-2.6 0-5.2-4.3-9.5-9.5-9.5"/>`;

const page = await (await puppeteer.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox", "--disable-dev-shm-usage"] })).newPage();

async function shot(html, w, h, transparent) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><meta charset=utf-8><body style="margin:0;overflow:hidden;background:${transparent ? "transparent" : "#f6821f"}">${html}</body>`, { waitUntil: "load" });
  return page.screenshot({ omitBackground: transparent });
}

const DENS = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
const ADP = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
const mark = s => `<svg viewBox="54.4 3.2 49.2 22.6" width="${s}" height="${s * 22.6 / 49.2}" style="display:block">${CLOUD}</svg>`;

for (const [dpi, px] of Object.entries(DENS)) {
  const dir = `native-res/mipmap-${dpi}`;
  mkdirSync(dir, { recursive: true });
  const icon = await shot(`<div style="width:${px}px;height:${px}px;border-radius:${Math.round(px * 0.1875)}px;background:#fff;display:grid;place-items:center">${mark(px * 0.72)}</div>`, px, px, false);
  writeFileSync(`${dir}/ic_launcher.png`, icon);
  writeFileSync(`${dir}/ic_launcher_round.png`, icon);
  const fg = await shot(`<div style="width:${ADP[dpi]}px;height:${ADP[dpi]}px;display:grid;place-items:center">${mark(ADP[dpi] * 0.58)}</div>`, ADP[dpi], ADP[dpi], true);
  writeFileSync(`${dir}/ic_launcher_foreground.png`, fg);
  writeFileSync(`${dir}/ic_launcher_background.png`, await shot(`<div style="width:${ADP[dpi]}px;height:${ADP[dpi]}px;background:#fff"></div>`, ADP[dpi], ADP[dpi], false));
  console.log(dpi, "ok");
}
console.log("icons generated");
