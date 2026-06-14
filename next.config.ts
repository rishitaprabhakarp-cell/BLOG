import type { NextConfig } from "next";
import path from "path";

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
      mermaid: "mermaid/dist/mermaid.esm.mjs",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      mermaid: path.resolve(
        process.cwd(),
        "node_modules/mermaid/dist/mermaid.esm.mjs",
      ),
    };
    return config;
  },
};

export default nextConfig;
