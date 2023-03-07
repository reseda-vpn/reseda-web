module.exports = {
	async headers() {
		return [
			{
				// matching all API routes
				source: "/api/:path*",
				headers: [
				{ key: "Access-Control-Allow-Credentials", value: "true" },
				{ key: "Access-Control-Allow-Origin", value: "*" },
				{ key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
				{ key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
				]
			}
		]
	},
	async rewrites() {
		return [
			{
				source: '/drnm/:path*',
				destination: 'http://:path*:6231', // The :path parameter isn't used here so will be automatically passed in the query
			},
            {
                source: '/api/:path*',
                destination: '/next-api/:path*'
            }
		]
	},
    typescript: {
        ignoreBuildErrors: true
    }
};