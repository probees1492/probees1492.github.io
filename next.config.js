/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Static export for GitHub Pages
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // If hosting at username.github.io/repo-name, uncomment and set:
  // basePath: "/repo-name",
  // assetPrefix: "/repo-name/",
};
module.exports = nextConfig;
