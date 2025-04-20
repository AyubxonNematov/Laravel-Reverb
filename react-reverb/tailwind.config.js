/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary-color)',
                    hover: 'var(--primary-hover)'
                },
                secondary: {
                    DEFAULT: 'var(--secondary-color)'
                },
                success: {
                    DEFAULT: 'var(--success-color)'
                },
                danger: {
                    DEFAULT: 'var(--danger-color)'
                },
                warning: {
                    DEFAULT: 'var(--warning-color)'
                },
                info: {
                    DEFAULT: 'var(--info-color)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'bounce-slow': 'bounce 3s infinite'
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio')
    ]
}; 