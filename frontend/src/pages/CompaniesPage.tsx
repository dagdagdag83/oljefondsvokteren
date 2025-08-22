import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCompanyData } from '../hooks/useCompanyData'
import { Company } from '../types'
import { CompanyCard } from '../components/companies/CompanyCard'
import { CompanyFilters } from '../components/companies/CompanyFilters'
import { Pagination } from '../components/companies/Pagination'

export default function CompaniesPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const [searchParams, setSearchParams] = useSearchParams()

	const [q, setQ] = useState(searchParams.get('q') || '')
	const [country, setCountry] = useState<string | null>(searchParams.get('country') || '')
	const [sector, setSector] = useState<string | null>(searchParams.get('sector') || '')
	const [category, setCategory] = useState(searchParams.get('category') || '')
	const [reportType, setReportType] = useState(searchParams.get('reportType') || '')
	const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))

	const filteredCompanies = useMemo(() => {
		return companies
			.filter((c) => {
				const searchLower = q.toLowerCase()
				const shallowReport = c.shallowReport?.riskAssessment
				const concernsMatch = shallowReport?.concerns?.toLowerCase().includes(searchLower) ?? false
				const rationaleMatch = shallowReport?.rationale?.toLowerCase().includes(searchLower) ?? false

				return (
					(c.name.toLowerCase().includes(searchLower) || concernsMatch || rationaleMatch) &&
					(!country || c.country.toLowerCase() === country.toLowerCase()) &&
					(!sector || c.sector.toLowerCase() === sector.toLowerCase()) &&
					(!category || (c.category && c.category.toString() === category)) &&
					(!reportType || c.aiReportStatus.toString() === reportType)
				)
			})
			.sort((a, b) => {
				if (a.aiReportStatus !== b.aiReportStatus) {
					return b.aiReportStatus - a.aiReportStatus
				}
				const categoryA = a.category ?? 99
				const categoryB = b.category ?? 99
				if (categoryA !== categoryB) {
					return categoryA - categoryB
				}
				return a.name.localeCompare(b.name)
			})
	}, [companies, q, country, sector, category, reportType])

	const ITEMS_PER_PAGE = 50
	const pageCount = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)
	const paginatedCompanies = filteredCompanies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

	useEffect(() => {
		const params = new URLSearchParams()
		if (q) params.set('q', q)
		if (country) params.set('country', country)
		if (sector) params.set('sector', sector)
		if (category) params.set('category', category)
		if (reportType) params.set('reportType', reportType)
		if (page > 1) params.set('page', page.toString())
		setSearchParams(params)
	}, [q, country, sector, category, reportType, page, setSearchParams])

	useEffect(() => {
		setPage(1)
	}, [q, country, sector, category, reportType])

	return (
		<div className="grid gap-6">
			<h2 className="text-2xl font-semibold tracking-tight">{t('app.companies')}</h2>
			<CompanyFilters
				companies={companies}
				q={q}
				setQ={setQ}
				country={country}
				setCountry={setCountry}
				sector={sector}
				setSector={setSector}
				category={category}
				setCategory={setCategory}
				reportType={reportType}
				setReportType={setReportType}
			/>

			{error && <p className="text-red-600">Error: {error.message}</p>}
			{loading && <p className="text-gray-500">Loading…</p>}
			{!loading && !error && (
				<div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{paginatedCompanies.map((c) => (
							<CompanyCard key={c.id} company={c} />
						))}
					</div>
					<Pagination page={page} pageCount={pageCount} setPage={setPage} />
				</div>
			)}
		</div>
	)
}
