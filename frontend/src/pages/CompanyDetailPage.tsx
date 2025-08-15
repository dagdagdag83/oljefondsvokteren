import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Flags from 'country-flag-icons/react/3x2'
import { countryCodeMap } from '../shared/countryCodeMap'
import { DetailedCompanyView } from './DetailedCompanyView'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useCompanyData } from '../shared/useCompanyData'

export default function CompanyDetailPage() {
	const { id } = useParams<{ id: string }>()
	const { companies, loading, error } = useCompanyData()
	const [detailedData, setDetailedData] = useState<any | null>(null)

	const company = companies.find((c) => c.id === id)

	useEffect(() => {
		// Attempt to load detailed analysis
		if (id === 'melexis-nv') {
			fetch(`${import.meta.env.BASE_URL}mel.json`)
				.then((r) => r.json())
				.then(setDetailedData)
				.catch(() => {
					// Ignore if not found
				})
		}
	}, [id])

	if (loading) return <p className="text-gray-500">Loading…</p>
	if (error) return <p className="text-red-600">Error: {error.message}</p>
	if (!company) return <p className="text-red-600">Company not found</p>

	const FlagComponent = countryCodeMap[company.country] ? Flags[countryCodeMap[company.country] as keyof typeof Flags] : null

	return (
		<div className="grid gap-4">
			<Link className="text-blue-700 hover:underline dark:text-blue-400" to="/companies">
				← Back to companies
			</Link>

			<h2 className="text-2xl font-semibold tracking-tight">{company.name}</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-600 dark:text-gray-300">
				<div>
					<span className="font-medium text-gray-900 dark:text-gray-100">Country:</span>
					<span className="ml-2 flex items-center">
						{FlagComponent && <FlagComponent className="h-4 w-4 mr-2" />}
						{company.country}
					</span>
				</div>
				<div>
					<span className="font-medium text-gray-900 dark:text-gray-100">Sector:</span> {company.sector}
				</div>
				<div>
					<span className="font-medium text-gray-900 dark:text-gray-100">Category:</span> {company.category}
				</div>
			</div>
			<div className="rounded-lg border border-white/40 bg-white/80 p-4 dark:bg-slate-900/70">
				<h3 className="text-lg font-medium mb-1">Guideline</h3>
				<p className="text-gray-800 dark:text-gray-100">{company.guideline}</p>
			</div>
			<div className="rounded-lg border border-white/40 bg-white/80 p-4 dark:bg-slate-900/70">
				<h3 className="text-lg font-medium mb-1">Concerns</h3>
				<p className="text-gray-800 dark:text-gray-100">{company.concerns}</p>
			</div>
			<div className="rounded-lg border border-white/40 bg-white/80 p-4 dark:bg-slate-900/70">
				<h3 className="text-lg font-medium mb-1">Rationale</h3>
				<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{company.rationale}</p>
			</div>

			{detailedData ? (
				<DetailedCompanyView data={detailedData} />
			) : (
				<div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
					<div className="flex">
						<div className="flex-shrink-0">
							<InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Deep AI Analysis Not Completed</h3>
							<div className="mt-2 text-sm text-yellow-700 dark:text-yellow-100">
								<p>A full analysis for this company is pending.</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}


