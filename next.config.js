/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "gateway.ipfscdn.io",
      "storage.opensea.io",
      "via.placeholder.com",
      "cdn.sanity.io",
    ],
  },
};

module.exports = nextConfig;
