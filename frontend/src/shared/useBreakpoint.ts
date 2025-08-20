import { useEffect, useState } from 'react'

const getBreakpoint = (width: number) => {
	if (width < 640) return 'sm'
	if (width < 768) return 'md'
	if (width < 1024) return 'lg'
	return 'xl'
}

export function useBreakpoint() {
	const [breakpoint, setBreakpoint] = useState(() => getBreakpoint(window.innerWidth))

	useEffect(() => {
		const calcInnerWidth = () => {
			setBreakpoint(getBreakpoint(window.innerWidth))
		}
		window.addEventListener('resize', calcInnerWidth)
		return () => window.removeEventListener('resize', calcInnerWidth)
	}, [])

	return breakpoint
}
