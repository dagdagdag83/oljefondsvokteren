import React from 'react'
import { Link, useParams } from 'react-router-dom'
import * as Flags from 'country-flag-icons/react/3x2'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Company, useCompanyData } from '../shared/useCompanyData'
import { Badge } from './CompaniesPage.tsx'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale)

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

const getCountryCode = (countryName: string): string | undefined => {
	if (countryName === 'United States') return 'US'
	if (countryName === 'United Kingdom') return 'GB'
	return countries.getAlpha2Code(countryName, 'en')
}

export default function CompanyDetailPage() {
	const { id } = useParams<{ id: string }>()
	const { companies, loading, error } = useCompanyData()

	const company = companies.find((c) => c.id === id)

	if (loading) return <p className="text-gray-500">Loading…</p>
	if (error) return <p className="text-red-600">Error: {error.message}</p>
	if (!company) return <p className="text-red-600">Company not found</p>

	const countryCode = getCountryCode(company.country)
	const FlagComponent = countryCode ? Flags[countryCode as keyof typeof Flags] : null

	return (
		<div className="grid gap-4">
			<div className="flex justify-between items-center">
				<Link className="text-blue-700 hover:underline dark:text-blue-400" to="/companies">
					← Back to companies
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2 space-y-4">
					<h2 className="text-2xl font-semibold tracking-tight">{company.name}</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
						<div className="flex items-center">
							<span className="font-medium text-gray-900 dark:text-gray-100">Country:</span>
							<span className="ml-2 flex items-center">
								{FlagComponent && <FlagComponent className="h-4 w-4 mr-2" />}
								{company.country}
							</span>
						</div>
						<div className="flex items-center">
							<span className="font-medium text-gray-900 dark:text-gray-100">Sector:</span>
							<span className="ml-2">{company.sector}</span>
						</div>
						<div className="flex items-center">
							<span className="font-medium text-gray-900 dark:text-gray-100">Category:</span>
							<span className="ml-2">{company.category ? <Badge n={company.category} /> : '-'}</span>
						</div>
						{company.incorporationCountry && (
							<div className="flex items-center">
								<span className="font-medium text-gray-900 dark:text-gray-100">Incorporation Country:</span>
								<span className="ml-2 flex items-center">
									{company.incorporationCountry && getCountryCode(company.incorporationCountry) && Flags[getCountryCode(company.incorporationCountry) as keyof typeof Flags] && (
										React.createElement(Flags[getCountryCode(company.incorporationCountry) as keyof typeof Flags], { className: 'h-4 w-4 mr-2' })
									)}
									{company.incorporationCountry}
								</span>
							</div>
						)}
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
					{company.detailedReport ? (
						<div className="rounded-lg border border-white/40 bg-white/80 p-4 dark:bg-slate-900/70">
							<h3 className="text-lg font-medium mb-2">Deep Research Report</h3>
							<p className="mb-4">A deep-dive AI analysis has been conducted for this company.</p>
							<div className="flex justify-end">
								<Link
									to={`/report/${company.id}`}
									className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/80"
								>
									View Full Report
								</Link>
							</div>
						</div>
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
				<div className="space-y-4">
					<div className="rounded-lg border border-white/40 bg-white/80 p-4 dark:bg-slate-900/70">
						<h3 className="text-lg font-medium mb-2">Investment Snapshot</h3>
						<div className="space-y-2">
							<div>
								<p className="text-sm text-gray-500">Market Value (NOK)</p>
								<p className="text-xl font-semibold">
									{new Intl.NumberFormat('nb-NO').format(company.marketValue)} ({formatToHumanMonetary(company.marketValue)})
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Ownership %</p>
								<p className="text-xl font-semibold">{company.ownership}%</p>
							</div>
							{company.voting && (
								<div>
									<p className="text-sm text-gray-500">Voting %</p>
									<p className="text-xl font-semibold">{company.voting}%</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


