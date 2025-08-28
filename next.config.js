/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
env: {
MY_ENV: process.env.MY_ENV || "development_default"
},
};
module.exports = nextConfig;
