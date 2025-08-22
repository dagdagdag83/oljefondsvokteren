import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { CategoryBadge } from '../CategoryBadge'
import { CustomTooltip } from './CustomTooltip'

interface CategoryDonutProps {
	title: string
	data: Record<string, number>
}

export function CategoryDonut({ title, data }: CategoryDonutProps) {
	const { t } = useTranslation()
	const breakpoint = useBreakpoint()
	const isMobile = breakpoint === 'sm'
	const mapping: Record<string, { key: string; color: string }> = {
		'1': { key: 'companies.category.c1', color: '#ef4444' }, // red-500
		'2': { key: 'companies.category.c2', color: '#f97316' }, // orange-500
		'3': { key: 'companies.category.c3', color: '#eab308' }, // yellow-500
		'4': { key: 'companies.category.c4', color: '#22c55e' }, // green-500
		'undefined': { key: 'undefined', color: '#64748b' }, // slate-500
	}
	const acceptableCount = data['4'] || 0
	const entries = Object.entries(data)
		.filter(([k]) => k !== 'undefined' && k !== '4')
		.sort((a, b) => Number(a[0]) - Number(b[0]))

	const chartData = entries.map(([k, v]) => ({
		name: k,
		value: v,
		labelKey: mapping[k]?.key ?? k,
		color: mapping[k]?.color ?? '#64748b',
	}))
	const total = chartData.reduce((s, d) => s + d.value, 0)
	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className={`h-56 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} items-center gap-2`}>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie data={chartData} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%" paddingAngle={2} cornerRadius={4}>
							{chartData.map((entry, idx) => (
								<Cell key={`c-${idx}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip
							cursor={{ fill: '#00205B', fillOpacity: 0.2 }}
							content={
								<CustomTooltip
									formatter={(value: any, name: any, payload: any) => {
										const labelKey = payload.labelKey
										const translatedLabel = t(`charts.${labelKey}`, { defaultValue: labelKey })
										return `${translatedLabel}: ${value}`
									}}
								/>
							}
						/>
					</PieChart>
				</ResponsiveContainer>
				<div className="text-sm h-full overflow-y-auto">
					<p className="text-xs text-gray-500">{t('overview.total_analyzed')}</p>
					<p className="text-2xl font-semibold">{total}</p>
					<ul className="mt-2 space-y-1">
						{chartData.map((d) => (
							<li key={d.name} className="flex items-center gap-2">
								<CategoryBadge n={parseInt(d.name, 10)} className="h-4 w-4" />
								<span className="text-gray-700 dark:text-gray-200">
									{t(d.labelKey, { defaultValue: d.name })}: {d.value}
								</span>
							</li>
						))}
					</ul>
					{acceptableCount > 0 && (
						<p className="text-xs text-gray-500 mt-2 italic">
							{t('overview.acceptable_risk_not_shown', { count: acceptableCount })}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
