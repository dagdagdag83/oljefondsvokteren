/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import lineClamp from '@tailwindcss/line-clamp'

export default {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				primary: '#00205B',
				secondary: '#EAEAEA',
				accentGold: '#D4AF37',
				accentGreen: '#22C55E',
			},
		},
	},
	plugins: [forms, typography, lineClamp],
}


