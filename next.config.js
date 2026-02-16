/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    // Disable static optimization for pages with useSearchParams
    async headers() {
        return [
            {
                source: '/dashboard/service-orders',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
