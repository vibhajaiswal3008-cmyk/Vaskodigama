// Zero-dependency static server for the exported `out/` folder.
// Usage: node scripts/serve-out.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");
const port = Number(process.argv[2]) || Number(process.env.PORT) || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function resolve(urlPath) {
  // Strip query/hash and decode.
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, "");
  let p = join(root, safe);
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, "index.html");
    return p;
  } catch {
    // Try the folder-with-index form (trailingSlash export).
    try {
      const withIndex = join(root, safe, "index.html");
      await stat(withIndex);
      return withIndex;
    } catch {
      return join(root, "404.html");
    }
  }
}

const server = createServer(async (req, res) => {
  try {
    const file = await resolve(req.url || "/");
    const body = await readFile(file);
    const isNotFound = file.endsWith("404.html");
    res.writeHead(isNotFound ? 404 : 200, {
      "content-type": types[extname(file)] || "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(port, () => {
  console.log(`Vaskodigama static export served at http://localhost:${port}`);
});
