/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                flashxship: {
                    'light-gray': '#F5F5F5',
                    'gray': '#9E9E9E',
                    'white': '#FFFFFF',
                    'black': '#000000',
                    'red': '#D32F2F',
                    'dark-gray': '#424242',
                    'very-light-gray': '#FAFAFA',
                },
            },
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
                'playfair': ['"Playfair Display"', 'serif'],
                'roboto': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                'sans': ['Poppins', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-subtle': 'pulseSubtle 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
            },
            boxShadow: {
                'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
                'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
                'strong': '0 8px 35px rgba(0, 0, 0, 0.15)',
                'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
