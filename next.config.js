/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ID === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // For demo purposes
  }
};

module.exports = withPWA(nextConfig);
