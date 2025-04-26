/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL || 'http://localhost:3000/api',
  },
  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en'
  },
};

export default nextConfig;