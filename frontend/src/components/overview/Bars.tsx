import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { shortenSector } from '../../utils/utils'
import { CustomTooltip } from './CustomTooltip'

// Custom hook to get theme preference
function useTheme() {
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

	useEffect(() => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
					setTheme(newTheme)
				}
			})
		})
		observer.observe(document.documentElement, { attributes: true })
		return () => observer.disconnect()
	}, [])

	return theme
}
export function Bars({ title, data, max }: { title: string; data: Record<string, number>; max?: number }) {
	const entries = Object.entries(data)
		.sort((a, b) => b[1] - a[1])
		.slice(0, max ?? Number.MAX_SAFE_INTEGER)
	const chartData = entries.map(([name, value]) => ({ name: shortenSector(name), value }))
	const theme = useTheme()
	const breakpoint = useBreakpoint()
	const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b' // slate-400 : slate-500
	const primaryColor = '#00205B'
	const isMobile = breakpoint === 'sm'

	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
						<XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
						<YAxis dataKey="name" type="category" width={isMobile ? 80 : 150} tick={{ fontSize: isMobile ? 10 : 12, fill: tickColor }} />
						<Tooltip
							cursor={{ fill: primaryColor, fillOpacity: 0.2 }}
							content={<CustomTooltip formatter={(value: any, name: any, payload: any) => `${payload.name}: ${value}`} />}
						/>
						<Bar dataKey="value" radius={[0, 4, 4, 0]}>
							{chartData.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={primaryColor} opacity={1 - (index / chartData.length) * 0.7} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
