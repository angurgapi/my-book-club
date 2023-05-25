/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'encrypted-tbn0.gstatic.com',
      'my-book-club-a097a.appspot.com',
    ],
  },
};

module.exports = nextConfig;
