import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'
import { shortenSector, formatToHumanMonetary } from '../../utils/utils'
import { CustomTooltip } from './CustomTooltip'

const COLORS = ['#88A0A8', '#00A1B2', '#E2A400', '#B25D00', '#7E52A0', '#D90429', '#3A6B35', '#4363D8', '#FFE119', '#3CB44B']

interface ValueDonutProps {
	title: string
	data: Record<string, number>
}

export function ValueDonut({ title, data }: ValueDonutProps) {
	const { t, i18n } = useTranslation()
	const entries = Object.entries(data)
		.sort(([, v1], [, v2]) => v2 - v1)
		.slice(0, 7)

	const chartData = entries.map(([name, value]) => ({ name: shortenSector(name), value }))
	const total = entries.reduce((s, [, v]) => s + v, 0)

	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4 flex-1 flex flex-col">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className="h-56 grid grid-cols-2 items-center gap-2 flex-grow">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie data={chartData} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%" paddingAngle={2} cornerRadius={4}>
							{chartData.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							cursor={{ fill: '#00205B', fillOpacity: 0.2 }}
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
					</PieChart>
				</ResponsiveContainer>
				<div className="text-sm h-full overflow-y-auto">
					<p className="text-xs text-gray-500">{t('overview.total_high_risk_value')}</p>
					<p className="text-2xl font-semibold">{formatToHumanMonetary(total, i18n.language)}</p>
					<ul className="space-y-1 mt-2">
						{chartData.map((d, index) => (
							<li key={d.name} className="flex items-center gap-2">
								<span className="inline-block h-3 w-3 rounded-sm" style={{ background: COLORS[index % COLORS.length] }} />
								<span className="text-gray-700 dark:text-gray-200 truncate" title={d.name}>
									{d.name}: {formatToHumanMonetary(d.value, i18n.language)}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
