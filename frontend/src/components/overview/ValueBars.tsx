import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { formatToHumanMonetary } from '../../utils/utils'
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

export function ValueBars({
	title,
	data,
	max,
}: {
	title: string
	data: Record<string, number> | { name: string; value: number }[]
	max?: number
}) {
	const { t, i18n } = useTranslation()
	const theme = useTheme()
	const breakpoint = useBreakpoint()
	const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b'
	const primaryColor = '#00205B'
	const isMobile = breakpoint === 'sm'

	const entries = Array.isArray(data)
		? data
		: Object.entries(data)
				.sort((a, b) => b[1] - a[1])
				.map(([name, value]) => ({ name, value }))

	const chartData = entries.slice(0, max ?? Number.MAX_SAFE_INTEGER)

	if (chartData.length === 0 || chartData.every((d) => d.value === 0)) {
		return (
			<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
				<h3 className="text-lg font-medium mb-2">{title}</h3>
				<div className="h-96 flex items-center justify-center text-gray-500">
					<p>{t('overview.no_data')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className="h-96">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
						<XAxis
							type="number"
							tick={{ fontSize: 12, fill: tickColor }}
							tickFormatter={(value) => formatToHumanMonetary(value as number, i18n.language)}
						/>
						<YAxis dataKey="name" type="category" width={isMobile ? 80 : 150} tick={{ fontSize: isMobile ? 10 : 12, fill: tickColor }} />
						<Tooltip
							cursor={{ fill: primaryColor, fillOpacity: 0.2 }}
							content={
								<CustomTooltip
									formatter={(value: any, name: any, payload: any) =>
										`${payload.name}: ${new Intl.NumberFormat('nb-NO').format(value)} NOK (${formatToHumanMonetary(
											value,
											i18n.language,
										)})`
									}
								/>
							}
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
