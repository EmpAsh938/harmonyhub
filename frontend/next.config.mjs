/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_ENDPOINT: "http://localhost:8000",
    },
    images: {
        remotePatterns: [{
            hostname: 'res.cloudinary.com',
        }
        ],
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
