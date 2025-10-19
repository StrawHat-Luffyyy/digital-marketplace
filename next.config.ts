/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nxkxhpmuviukamaekfnu.supabase.co',
        port: '',
        // This is the corrected, more general pathname
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

module.exports = nextConfig;