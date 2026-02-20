/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        '@tailwindcss/postcss': {}, // Changed from 'tailwindcss'
        autoprefixer: {},
    },
};

export default config;
