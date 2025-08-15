import { useEffect, useState } from 'react'
import { useApiBase } from '../shared/useApiBase'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCompanyData } from '../shared/useCompanyData'

type Stats = {
	total: number
	by_category: Record<string, number>
	by_country: Record<string, number>
	by_sector: Record<string, number>
}

export default function OverviewPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const [stats, setStats] = useState<Stats | null>(null)
	const [isBannerVisible, setIsBannerVisible] = useState(true)

	useEffect(() => {
		if (companies.length > 0) {
			const byCategory: Record<string, number> = {}
			const byCountry: Record<string, number> = {}
			const bySector: Record<string, number> = {}
			for (const c of companies) {
				byCategory[c.category] = (byCategory[c.category] || 0) + 1
				byCountry[c.country] = (byCountry[c.country] || 0) + 1
				bySector[c.sector] = (bySector[c.sector] || 0) + 1
			}
			setStats({
				total: companies.length,
				by_category: byCategory,
				by_country: byCountry,
				by_sector: bySector,
			})
		}
	}, [companies])

	return (
		<div className="grid gap-6">
			{isBannerVisible && (
				<div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
					<div className="flex">
						<div className="flex-shrink-0">
							<InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
						</div>
						<div className="ml-3 flex-1 md:flex md:justify-between">
							<p className="text-sm text-blue-700 dark:text-blue-200">{t('landing.banner.text')}</p>
							<p className="mt-3 text-sm md:ml-6 md:mt-0">
								<button
									onClick={() => setIsBannerVisible(false)}
									className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 dark:text-blue-200 dark:hover:text-blue-100"
								>
									{t('landing.banner.dismiss')}
								</button>
							</p>
						</div>
					</div>
				</div>
			)}
			<section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#00143a] text-white">
				<div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
				<div className="container py-10 grid md:grid-cols-2 items-center gap-6">
					<div className="prose prose-invert max-w-none">
						<h1 className="m-0">{t('app.title')}</h1>
						<p>{t('landing.lead')}</p>
						<div className="flex flex-wrap gap-3">
							<Link to="/companies" className="inline-flex items-center rounded-md bg-white/95 px-4 py-2 text-primary font-medium hover:bg-white">{t('app.browseCompanies')}</Link>
							<a href="https://www.nbim.no" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 text-white hover:bg-white/10">{t('app.aboutNbim')}</a>
						</div>
					</div>
					<div className="hidden md:block">
						<div className="rounded-lg border border-white/20 bg-white/10 p-4">
							<p className="text-sm uppercase tracking-wide text-white/80 mb-2">{t('landing.snapshot')}</p>
							<div className="grid grid-cols-3 gap-4 text-center">
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
			</section>

			<h2 className="text-xl font-semibold tracking-tight">{t('app.insights')}</h2>
			{error && <p className="text-red-600">Error: {error.message}</p>}
			{loading && <p className="text-gray-500">Loading…</p>}
			{stats && (
				<div className="grid gap-6">
					<div className="rounded-lg border border-white/40 bg-white/70 backdrop-blur p-4 dark:bg-slate-900/70">
						<p className="text-sm text-gray-500">Total companies</p>
						<p className="text-3xl font-semibold">{stats.total}</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<CategoryDonut title={t('charts.byCategory')} data={stats.by_category} />
						<Bars title={t('charts.bySector')} data={stats.by_sector} max={8} />
						<Bars title={t('charts.topCountries')} data={stats.by_country} max={10} />
					</div>
				</div>
			)}
		</div>
	)
}

function Bars({ title, data, max }: { title: string, data: Record<string, number>, max?: number }) {
	const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
		.slice(0, max ?? Number.MAX_SAFE_INTEGER)
	const chartData = entries.map(([name, value]) => ({ name, value }))
	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
						<XAxis dataKey="name" hide={chartData.length > 12} tick={{ fontSize: 12 }} interval={0} angle={-20} dy={10} height={chartData.length > 12 ? 0 : 40} />
						<YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
						<Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', borderRadius: 8, border: '1px solid #e5e7eb' }} />
						<Bar dataKey="value" fill="#00205B" radius={[4,4,0,0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

function CategoryDonut({ title, data }: { title: string, data: Record<string, number> }) {
	const { t } = useTranslation()
	const mapping: Record<string, { key: string, color: string }> = {
		'1': { key: 'ok', color: '#16a34a' },
		'2': { key: 'monitor', color: '#2563eb' },
		'3': { key: 'observe', color: '#ea580c' },
		'4': { key: 'exclude', color: '#b91c1c' },
	}
	const entries = Object.entries(data).sort((a, b) => Number(a[0]) - Number(b[0]))
	const chartData = entries.map(([k, v]) => ({ name: k, value: v, labelKey: mapping[k]?.key ?? k, color: mapping[k]?.color ?? '#64748b' }))
	const total = chartData.reduce((s, d) => s + d.value, 0)
	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<div className="h-64 grid grid-cols-2 items-center gap-2">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={2}>
							{chartData.map((entry, idx) => (<Cell key={`c-${idx}`} fill={entry.color} />))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
				<div className="text-sm">
					<p className="text-xs text-gray-500">Total</p>
					<p className="text-2xl font-semibold">{total}</p>
					<ul className="mt-2 space-y-1">
						{chartData.map((d) => (
							<li key={d.name} className="flex items-center gap-2">
								<span className="inline-block h-3 w-3 rounded-sm" style={{ background: d.color }} />
								<span className="text-gray-700 dark:text-gray-200">{t(`charts.${d.labelKey}`, { defaultValue: d.name })}: {d.value}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}


