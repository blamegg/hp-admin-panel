/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  swcMinify: true,
  
  // Disable React Strict Mode to prevent double renders
  reactStrictMode: false,
};

export default nextConfig;
