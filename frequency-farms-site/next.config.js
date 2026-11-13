/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /s on its own isn't a page; send it home.
      { source: "/s", destination: "/", permanent: false },
      // If a strain slug is ever renamed after bags are printed, add the
      // old one here so already-printed QR codes keep working, e.g.
      // { source: "/s/old-slug", destination: "/s/new-slug", permanent: true },
    ];
  },
};

module.exports = nextConfig;
