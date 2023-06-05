/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'encrypted-tbn0.gstatic.com',
      'my-book-club-a097a.appspot.com',
      'www.facebook.com',
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
