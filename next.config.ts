import type { NextConfig } from "next";
import path from "path";

const mermaidEsm = path.join(
  process.cwd(),
  "node_modules/mermaid/dist/mermaid.esm.mjs",
);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  transpilePackages: ["mermaid"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
    ],
  },
  turbopack: {
    resolveAlias: {
      mermaid: mermaidEsm,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      mermaid: mermaidEsm,
    };
    return config;
  },
};

export default nextConfig;
