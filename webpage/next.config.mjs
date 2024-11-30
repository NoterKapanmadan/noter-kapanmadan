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
      {
        protocol: process.env.NEXT_PUBLIC_FILE_SERVER_URL.startsWith('https') ? 'https' : 'http',
        hostname: process.env.NEXT_PUBLIC_FILE_SERVER_URL.replace('http://', '').replace('https://', '').split('/')[0].split(':')[0],
        port: process.env.NEXT_PUBLIC_FILE_SERVER_URL.replace('http://', '').replace('https://', '').split(':')[1] || '',
        pathname: `${process.env.NEXT_PUBLIC_FILE_SERVER_URL.replace('http://', '').replace('https://', '').split('/')[1] ? `/${process.env.NEXT_PUBLIC_FILE_SERVER_URL.replace('http://', '').replace('https://', '').split('/')[1]}` : ''}/public/**`,
        search: '',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '100mb'
  },
};

export default nextConfig;
