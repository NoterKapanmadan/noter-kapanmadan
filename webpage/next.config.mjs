/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'player.sahibinden.com',
        port: '',
        pathname: '/*/**',
      },
    ],
  },
};

export default nextConfig;
