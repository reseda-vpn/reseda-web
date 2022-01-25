module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: 'https://api.lancero.app',
      },
    ]
  },
}
