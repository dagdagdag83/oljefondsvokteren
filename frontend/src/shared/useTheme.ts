import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

export type Theme = 'light' | 'dark'

export function useTheme(): [Theme, () => void] {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
		if (saved === 'dark' || saved === 'light') return saved
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	})

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') root.classList.add('dark')
		else root.classList.remove('dark')
		localStorage.setItem(STORAGE_KEY, theme)
	}, [theme])

	function toggle() {
		setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
	}

	return [theme, toggle]
}


