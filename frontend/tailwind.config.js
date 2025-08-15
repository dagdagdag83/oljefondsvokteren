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


