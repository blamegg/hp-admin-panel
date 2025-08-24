/** @type {import('next').NextConfig} */
const imageDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;

const nextConfig = {
  // Basic optimizations
  swcMinify: true,
  
  // Disable React Strict Mode to prevent double renders
  reactStrictMode: false,

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'react-icons',
      'lucide-react',
      'apexcharts',
      'react-apexcharts'
    ],
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: imageDomain ? imageDomain.split(',') : [],
  },

  // Compression
  compress: true,

  // Bundle analyzer (uncomment for analysis)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
