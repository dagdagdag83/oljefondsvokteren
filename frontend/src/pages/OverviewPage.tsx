import { useTranslation } from 'react-i18next'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useCompanyData } from '../hooks/useCompanyData'
import { HighRiskSummary } from '../components/overview/HighRiskSummary'
import { CategoryDonut } from '../components/overview/CategoryDonut'
import { ValueDonut } from '../components/overview/ValueDonut'
import { TopInvestmentsList } from '../components/overview/TopInvestmentsList'
import { Bars } from '../components/overview/Bars'
import { ValueBars } from '../components/overview/ValueBars'
import { Hero } from '../components/overview/Hero'
import { useOverviewStats } from '../hooks/useOverviewStats'

export default function OverviewPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const stats = useOverviewStats(companies)

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
			<Hero stats={stats} />

			<h2 className="text-xl font-semibold tracking-tight">{t('app.insights')}</h2>
			{error && <p className="text-red-600">Error: {error.message}</p>}
			{loading && <p className="text-gray-500">Loading…</p>}
			{stats && (
				<div className="grid gap-6">
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
						<div className="lg:col-span-3">
							<HighRiskSummary companies={companies} />
						</div>
						<div className="lg:col-span-2 flex flex-col gap-4">
							<CategoryDonut title={t('charts.byCategoryRisk')} data={stats.by_category} />
							<ValueDonut title={t('overview.high_risk_by_sector')} data={stats.high_risk_value_by_sector} />
							<ValueDonut title={t('overview.high_risk_by_country')} data={stats.high_risk_value_by_country} />
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6">
						<TopInvestmentsList companies={stats.top_investments} />
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