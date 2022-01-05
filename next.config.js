module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'i.ytimg.com', 'yt3.ggpht.com'],
  },
  async redirects() {
    return [
      {
        source: '/browse',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // ignoreDuringBuilds: true,
};
