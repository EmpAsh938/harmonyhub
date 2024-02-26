/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_ENDPOINT: "https://harmonyhub-jj6z.onrender.com",
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
