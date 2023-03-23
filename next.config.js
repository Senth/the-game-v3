/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
