import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatToHumanMonetary } from '../../utils/utils'

interface HeroProps {
	stats: {
		totalValue: number
		total: number
		by_sector: Record<string, number>
		by_country: Record<string, number>
	} | null
}

export function Hero({ stats }: HeroProps) {
	const { t, i18n } = useTranslation()
	return (
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
									<p className="text-3xl font-semibold">{formatToHumanMonetary(stats?.totalValue ?? 0, i18n.language)}</p>
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
	)
}
