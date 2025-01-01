/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      // 👇 change file size limit
      bodySizeLimit: "1000MB",
    }
  }
};

export default nextConfig;
