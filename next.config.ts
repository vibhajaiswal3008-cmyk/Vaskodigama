import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export → produces a browsable `out/` folder (no server needed).
  // All data is local/illustrative and there are no server actions or route
  // handlers, so the whole app exports to static HTML.
  output: "export",
  images: { unoptimized: true },
  // Emit each route as a folder with index.html so paths work when served.
  trailingSlash: true,
};

export default nextConfig;
