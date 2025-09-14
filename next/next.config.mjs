/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    viewTransition: true,
    // Next.js 15.5 performance optimizations
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic routes
      static: 180, // 3 minutes for static routes  
    },
    // Enable parallel route preloading
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Optimize bundling for better performance
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        sanity: {
          name: 'sanity',
          test: /[\\/]node_modules[\\/](@sanity|next-sanity)[\\/]/,
          chunks: 'all',
          priority: 10,
        },
      }
    }
    return config
  },
}

export default nextConfig
