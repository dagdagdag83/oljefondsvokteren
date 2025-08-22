import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Company } from '../../types'
import { getCountryCode, shortenSector, formatToHumanMonetary } from '../../utils/utils'
import * as Flags from 'country-flag-icons/react/3x2'
import { DocumentCheckIcon, DocumentIcon, DocumentMinusIcon } from '@heroicons/react/24/outline'
import { CategoryBadge } from '../CategoryBadge'

interface TopInvestmentsListProps {
	companies: Company[]
}

export function TopInvestmentsList({ companies }: TopInvestmentsListProps) {
	const { t, i18n } = useTranslation()
	return (
		<div className="rounded-lg border border-white/40 bg-white/80 dark:bg-slate-900/70 p-4">
			<h3 className="text-lg font-medium mb-2">{t('charts.topInvestments')}</h3>
			<div className="flex flex-col gap-3">
				{companies.map((c) => {
					const countryCode = getCountryCode(c.country)
					const FlagComponent = countryCode ? Flags[countryCode as keyof typeof Flags] : null

					return (
						<Link
							key={c.id}
							to={`/companies/${encodeURIComponent(c.id)}`}
							className="block rounded-md p-3 bg-white/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/60 transition-colors"
						>
							<div className="flex justify-between items-center">
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-primary dark:text-blue-300 text-sm truncate" title={c.name}>
										{c.name}
									</p>
									<div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-3 mt-1">
										<span className="flex items-center gap-1.5">
											{FlagComponent && <FlagComponent className="h-3 w-3" />}
											{c.country}
										</span>
										<span>{shortenSector(c.sector)}</span>
									</div>
								</div>
								<div className="flex items-center gap-3 ml-4">
									<p className="text-lg font-bold text-right">
										{formatToHumanMonetary(c.marketValueNok, i18n.language)} NOK
									</p>
									<div className="flex items-center gap-2">
										{c.aiReportStatus === 2 && <DocumentCheckIcon className="h-6 w-6 text-accentGreen" title={t('overview.full_report')} />}
										{c.aiReportStatus === 1 && <DocumentIcon className="h-6 w-6 text-yellow-500" title={t('overview.basic_report')} />}
										{c.aiReportStatus === 0 && <DocumentMinusIcon className="h-6 w-6 text-gray-400" title={t('overview.no_report')} />}
										{c.category && <CategoryBadge n={c.category} />}
									</div>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
