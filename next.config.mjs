/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable server components to use external packages without failing build
    serverExternalPackages: ['@huggingface/transformers'],

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },

    async headers() {
        return [
            {
                source: '/wasm/:path*',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/wasm',
                    },
                ],
            },
        ];
    },


    webpack: (config) => {
        // Fix for transformers.js build failing on webpack client build
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        
        config.module.parser = {
            ...config.module.parser,
            javascript: {
                ...config.module.parser?.javascript,
                url: false,
            }
        };

        return config;
    },
};

export default nextConfig;
