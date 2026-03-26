/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ID === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react', '@privy-io/react-auth'],
  typescript: {
    ignoreBuildErrors: true, 
  },
  webpack: (config) => {
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    return config;
  },
};

module.exports = withPWA(nextConfig);
