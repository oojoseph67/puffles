/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ipfs.io", "images.app.goo.gl"],
    loader: "default",
  },
};

export default nextConfig;
