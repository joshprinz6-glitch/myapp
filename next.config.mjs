/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
env: {
MY_ENV: process.env.MY_ENV
}
};
module.exports = nextConfig;
