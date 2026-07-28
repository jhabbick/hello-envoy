import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, "../docs");
const outputPath = path.join(docsDir, "og-image.png");
const PORT = 4173;
const WIDTH = 1200;
const HEIGHT = 630;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
};

function createServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent(
      new URL(req.url, `http://127.0.0.1:${PORT}`).pathname
    );
    const relativePath = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");
    const filePath = path.resolve(docsDir, relativePath);

    if (!filePath.startsWith(docsDir)) {
      res.writeHead(403);
      res.end();
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }

      res.writeHead(200, {
        "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
      });
      res.end(data);
    });
  });
}

async function main() {
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

    await page.goto(`http://127.0.0.1:${PORT}/`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.waitForSelector("#shader-bg canvas", { timeout: 30000 });
    await page.waitForFunction(
      () => {
        const canvas = document.querySelector("#shader-bg canvas");
        return canvas && canvas.width > 0 && canvas.height > 0;
      },
      { timeout: 30000 }
    );

    await new Promise((resolve) => setTimeout(resolve, 2500));

    await page.evaluate(() => {
      document.querySelector(".floating-cta")?.remove();
      document.querySelector(".scroll-hint")?.remove();

      document.querySelectorAll("[data-panel]").forEach((panel, index) => {
        panel.classList.toggle("is-active", index === 0);
      });

      document.querySelectorAll(".hero-center .disclose").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.transition = "none";
      });
    });

    await page.screenshot({ path: outputPath, type: "png" });
    console.log(`Saved ${outputPath}`);
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
