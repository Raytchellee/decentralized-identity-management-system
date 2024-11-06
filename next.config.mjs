/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for Module not found: Can't resolve fs.
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

export default nextConfig;
