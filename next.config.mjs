/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en'
  },
};

export default nextConfig;