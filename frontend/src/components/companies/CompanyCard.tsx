import React from 'react'
import { Link } from 'react-router-dom'
import { Company } from '../../types'
import { CategoryBadge } from '../CategoryBadge'
import { DocumentCheckIcon, DocumentIcon, DocumentMinusIcon } from '@heroicons/react/24/outline'
import * as Flags from 'country-flag-icons/react/3x2'
import { getCountryCode, shortenSector, truncate } from '../../utils/utils'

interface CompanyCardProps {
	company: Company
}

export function CompanyCard({ company: c }: CompanyCardProps) {
	return (
		<Link
			to={`/companies/${encodeURIComponent(c.id)}`}
			key={c.id}
			className="block rounded-lg border border-white/40 bg-white/70 p-4 shadow-sm dark:bg-slate-900/70 hover:shadow-lg transition-shadow"
		>
			<div className="flex justify-between items-start">
				<h3 className="font-semibold text-primary dark:text-blue-300">{c.name}</h3>
				<div className="flex items-center gap-2 flex-shrink-0">
					{c.category ? <CategoryBadge n={c.category} /> : null}
					{c.aiReportStatus === 2 && <DocumentCheckIcon className="h-6 w-6 text-accentGreen" title="Full AI Research Report" />}
					{c.aiReportStatus === 1 && <DocumentIcon className="h-6 w-6 text-yellow-500" title="Basic AI Report" />}
					{c.aiReportStatus === 0 && <DocumentMinusIcon className="h-6 w-6 text-gray-400" title="No AI Report" />}
				</div>
			</div>
			<div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
				<div className="flex items-center">
					{React.createElement(Flags[getCountryCode(c.country) as keyof typeof Flags], {
						className: 'h-4 w-4 mr-2',
					})}
					{c.country}
				</div>
				<div>{shortenSector(c.sector)}</div>
			</div>
			{(c.deepReport?.riskAssessment?.concerns || c.shallowReport?.riskAssessment?.concerns) && (
				<div className="mt-2">
					<p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Concerns</p>
					<p className="text-sm text-gray-700 dark:text-gray-200">
						{truncate(c.deepReport?.riskAssessment?.concerns || c.shallowReport?.riskAssessment?.concerns || '', 100)}
					</p>
				</div>
			)}
		</Link>
	)
}
