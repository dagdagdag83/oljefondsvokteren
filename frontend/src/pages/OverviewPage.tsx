import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { InformationCircleIcon, ExclamationTriangleIcon, FireIcon } from '@heroicons/react/24/outline'
import { useCompanyData, Company } from '../shared/useCompanyData'
import { useBreakpoint } from '../shared/useBreakpoint'
import { CategoryBadge } from '../shared/CategoryBadge'

const shortenSector = (sector: string) => {
	return sector === 'Consumer Discretionary' ? 'Consumer Disc.' : sector
}

// New custom monetary formatting function
const formatToHumanMonetary = (value: number) => {
	if (Math.abs(value) >= 1e12) {
		return `${(value / 1e12).toFixed(1).replace(/\.0$/, '')}Tn`
	}
	if (Math.abs(value) >= 1e9) {
		return `${(value / 1e9).toFixed(1).replace(/\.0$/, '')}Bn`
	}
	if (Math.abs(value) >= 1e6) {
		return `${(value / 1e6).toFixed(1).replace(/\.0$/, '')}M`
	}
	if (Math.abs(value) >= 1e3) {
		return `${(value / 1e3).toFixed(1).replace(/\.0$/, '')}K`
	}
	return value.toString()
}

// Custom Tooltip Content Component
const CustomTooltip = ({ active, payload, formatter }: any) => {
	if (active && payload && payload.length) {
		const data = payload[0]
		const formattedText = formatter(data.value, data.name, data.payload)

		return (
			<div className="rounded-md border bg-background px-2 py-1 text-sm shadow-lg">
				<p>{formattedText}</p>
			</div>
		)
	}
	return null
}

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

// Custom hook to get theme colors
function useThemeColors() {
	const [colors, setColors] = useState({ primary: '#000', accent: '#000' })

	useEffect(() => {
		const style = getComputedStyle(document.documentElement)
		const primary = `hsl(${style.getPropertyValue('--primary')})`
		const accent = `hsl(${style.getPropertyValue('--accent')})`
		setColors({ primary, accent })
	}, [])

	return colors
}

type Stats = {
	total: number
	totalValue: number
	by_category: Record<string, number>
	by_country: Record<string, number>
	by_sector: Record<string, number>
	top_investments: { name: string; value: number }[]
	value_by_sector: Record<string, number>
	value_by_country: Record<string, number>
	high_risk_value_by_sector: Record<string, number>
}

export default function OverviewPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const [stats, setStats] = useState<Stats | null>(null)

	useEffect(() => {
		if (companies.length > 0) {
			const byCategory: Record<string, number> = {}
			const byCountry: Record<string, number> = {}
			const bySector: Record<string, number> = {}
			const valueBySector: Record<string, number> = {}
			const valueByCountry: Record<string, number> = {}
			const highRiskValueBySector: Record<string, number> = {}
			let totalValue = 0

			for (const c of companies) {
				const category = c.category?.toString()
				if (category) {
					byCategory[category] = (byCategory[category] || 0) + 1
				}
				byCountry[c.country] = (byCountry[c.country] || 0) + 1
				bySector[c.sector] = (bySector[c.sector] || 0) + 1
				if (c.marketValueNok) {
					totalValue += c.marketValueNok
					valueBySector[c.sector] = (valueBySector[c.sector] || 0) + c.marketValueNok
					valueByCountry[c.country] = (valueByCountry[c.country] || 0) + c.marketValueNok
					if (c.category === 1 || c.category === 2) {
						highRiskValueBySector[c.sector] = (highRiskValueBySector[c.sector] || 0) + c.marketValueNok
					}
				}
			}

			const topInvestments = [...companies]
				.sort((a, b) => (b.marketValueNok || 0) - (a.marketValueNok || 0))
				.slice(0, 10)
				.map((c) => ({ name: c.name, value: c.marketValueNok || 0 }))

			setStats({
				total: companies.length,
				totalValue: totalValue,
				by_category: byCategory,
				by_country: byCountry,
				by_sector: bySector,
				top_investments: topInvestments,
				value_by_sector: valueBySector,
				value_by_country: valueByCountry,
				high_risk_value_by_sector: highRiskValueBySector,
			})
		}
	}, [companies])

	return (
		<div className="grid gap-6">
			<div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
				<div className="flex">
					<div className="flex-shrink-0">
						<ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
					</div>
					<div className="ml-3 flex-1 md:flex md:justify-between">
						<p className="text-sm text-yellow-700 dark:text-yellow-200">{t('landing.banner.text')}</p>
					</div>
				</div>
			</div>
			<section className="relative overflow-hidden rounded-xl bg-primary text-white">
				<div className="absolute inset-0 bg-grid-slate-100/[0.05] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
				<div className="relative py-10 px-6 grid md:grid-cols-2 items-center gap-6">
					<div className="prose prose-invert max-w-none">
						<h1 className="m-0">{t('app.title')}</h1>
						<p>{t('landing.lead')}</p>
					</div>

					<div className="flex flex-col items-start gap-6">
						<div className="w-full">
							<Link
								to="/companies"
								className="inline-block w-full rounded-md bg-accentGreen px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-accentGreen/90 text-center"
							>
								{t('app.exploreCompanies')}
							</Link>
						</div>
						<div className="hidden md:block w-full">
							<div className="rounded-lg border border-white/20 bg-white/10 p-4">
								<p className="text-sm uppercase tracking-wide text-white/80 mb-2">{t('landing.snapshot')}</p>
								<div className="grid grid-cols-4 gap-4 text-center">
									<div>
										<p className="text-3xl font-semibold">{formatToHumanMonetary(stats?.totalValue ?? 0)}</p>
										<p className="text-xs text-white/80">{t('landing.totalValue')}</p>
									</div>
									<div>
										<p className="text-3xl font-semibold">{stats?.total ?? '—'}</p>
										<p className="text-xs text-white/80">{t('landing.companies')}</p>
									</div>
									<div>
										<p className="text-3xl font-semibold">{Object.keys(stats?.by_sector ?? {}).length}</p>
										<p className="text-xs text-white/80">{t('landing.sectors')}</p>
									</div>
									<div>
										<p className="text-3xl font-semibold">{Object.keys(stats?.by_country ?? {}).length}</p>
										<p className="text-xs text-white/80">{t('landing.countries')}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<h2 className="text-xl font-semibold tracking-tight">{t('app.insights')}</h2>
			{error && <p className="text-red-600">Error: {error.message}</p>}
			{loading && <p className="text-gray-500">Loading…</p>}
			{stats && (
				<div className="grid gap-6">
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
						<div className="lg:col-span-3">
							<HighRiskSummary companies={companies} />
						</div>
						<div className="lg:col-span-2 space-y-4">
							<CategoryDonut title={t('charts.byCategoryRisk')} data={stats.by_category} />
							<ValueDonut title="High-Risk Value by Sector" data={stats.high_risk_value_by_sector} />
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6">
						<ValueBars title={t('charts.topInvestments')} data={stats.top_investments} />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Bars title={t('charts.bySector')} data={stats.by_sector} max={8} />
						<Bars title={t('charts.topCountries')} data={stats.by_country} max={10} />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ValueBars title={t('charts.valueBySector')} data={stats.value_by_sector} />
						<ValueBars title={t('charts.valueByCountry')} data={stats.value_by_country} max={10} />
					</div>
				</div>
			)}
		</div>
	)
}

function HighRiskSummary({ companies }: { companies: Company[] }) {
	const topOverall = companies
		.filter((c) => c.category === 1)
		.sort((a, b) => (b.marketValueNok || 0) - (a.marketValueNok || 0))
		.slice(0, 5)

	const topWithDeepReport = companies
		.filter((c) => c.category === 1 && c.aiReportStatus === 2)
		.sort((a, b) => (b.marketValueNok || 0) - (a.marketValueNok || 0))
		.slice(0, 5)

	if (topOverall.length === 0) {
		return null
	}

	return (
		<div className="rounded-lg border border-red-500/50 bg-red-50/50 dark:bg-red-900/10 p-4 h-full flex flex-col">
			<div className="flex items-center gap-3 mb-3">
				<FireIcon className="h-6 w-6 text-red-500" />
				<h3 className="text-lg font-medium text-red-800 dark:text-red-200">Exclusion Candidate Spotlight</h3>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
				<div>
					<h4 className="font-semibold mb-2 text-center text-gray-700 dark:text-gray-200">Top 5 by Market Value</h4>
					<div className="flex flex-col gap-3">
						{topOverall.map((c) => (
							<Link
								key={c.id}
								to={`/companies/${encodeURIComponent(c.id)}`}
								className="block rounded-md p-3 bg-white/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
							>
								<div className="flex justify-between items-center">
									<p className="font-semibold text-primary dark:text-blue-300 text-sm truncate" title={c.name}>
										{c.name}
									</p>
									{c.category && <CategoryBadge n={c.category} />}
								</div>
								<p className="text-lg font-bold mt-1">{formatToHumanMonetary(c.marketValueNok)} NOK</p>
							</Link>
						))}
					</div>
				</div>
				<div>
					<h4 className="font-semibold mb-2 text-center text-gray-700 dark:text-gray-200">Top 5 with Deep Research</h4>
					<div className="flex flex-col gap-3">
						{topWithDeepReport.length > 0 ? (
							topWithDeepReport.map((c) => (
								<Link
									key={c.id}
									to={`/companies/${encodeURIComponent(c.id)}`}
									className="block rounded-md p-3 bg-white/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
								>
									<div className="flex justify-between items-center">
										<p className="font-semibold text-primary dark:text-blue-300 text-sm truncate" title={c.name}>
											{c.name}
										</p>
										{c.category && <CategoryBadge n={c.category} />}
									</div>
									<p className="text-lg font-bold mt-1">{formatToHumanMonetary(c.marketValueNok)} NOK</p>
								</Link>
							))
						) : (
							<div className="flex items-center justify-center h-full text-gray-500 italic">
								No companies with deep research reports in this category.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

function Bars({ title, data, max }: { title: string; data: Record<string, number>; max?: number }) {
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

function ValueBars({
	title,
	data,
	max,
}: {
	title: string
	data: Record<string, number> | { name: string; value: number }[]
	max?: number
}) {
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
					<p>No data available for this chart.</p>
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
						<XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} tickFormatter={(value) => formatToHumanMonetary(value as number)} />
						<YAxis dataKey="name" type="category" width={isMobile ? 80 : 150} tick={{ fontSize: isMobile ? 10 : 12, fill: tickColor }} />
						<Tooltip
							cursor={{ fill: primaryColor, fillOpacity: 0.2 }}
							content={
								<CustomTooltip
									formatter={(value: any, name: any, payload: any) =>
										`${payload.name}: ${new Intl.NumberFormat('nb-NO').format(value)} NOK (${formatToHumanMonetary(value)})`
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

function CategoryDonut({ title, data }: { title: string; data: Record<string, number> }) {
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
					<p className="text-xs text-gray-500">Total Analyzed</p>
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
							+ {acceptableCount} companies with acceptable risk not shown.
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

const COLORS = ['#88A0A8', '#00A1B2', '#E2A400', '#B25D00', '#7E52A0', '#D90429', '#3A6B35', '#4363D8', '#FFE119', '#3CB44B'];

function ValueDonut({ title, data }: { title: string; data: Record<string, number> }) {
	const entries = Object.entries(data)
		.sort(([, v1], [, v2]) => v2 - v1)
		.slice(0, 7)

	const chartData = entries.map(([name, value]) => ({ name: shortenSector(name), value }))
	const total = entries.reduce((s, [, v]) => s + v, 0)

	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className="h-56 grid grid-cols-2 items-center gap-2">
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
										`${payload.name}: ${new Intl.NumberFormat('nb-NO').format(value)} NOK (${formatToHumanMonetary(value)})`
									}
								/>
							}
						/>
					</PieChart>
				</ResponsiveContainer>
				<div className="text-sm h-full overflow-y-auto">
					<p className="text-xs text-gray-500">Total High-Risk Value</p>
					<p className="text-2xl font-semibold">{formatToHumanMonetary(total)}</p>
					<ul className="space-y-1 mt-2">
						{chartData.map((d, index) => (
							<li key={d.name} className="flex items-center gap-2">
								<span className="inline-block h-3 w-3 rounded-sm" style={{ background: COLORS[index % COLORS.length] }} />
								<span className="text-gray-700 dark:text-gray-200 truncate" title={d.name}>
									{d.name}: {formatToHumanMonetary(d.value)}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}