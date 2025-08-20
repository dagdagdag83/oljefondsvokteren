import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, MagnifyingGlassIcon, DocumentCheckIcon, DocumentIcon, DocumentMinusIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { Company, useCompanyData } from '../shared/useCompanyData'
import * as Flags from 'country-flag-icons/react/3x2'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { CategoryBadge } from '../shared/CategoryBadge'
import { getCountryCode, shortenSector, truncate, labelForCategory } from '../shared/utils'

countries.registerLocale(enLocale)

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

export default function CompaniesPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const [searchParams, setSearchParams] = useSearchParams()

	const [q, setQ] = useState(searchParams.get('q') || '')
	const [country, setCountry] = useState<string | null>(searchParams.get('country') || '')
	const [countryQuery, setCountryQuery] = useState('')
	const [sector, setSector] = useState<string | null>(searchParams.get('sector') || '')
	const [sectorQuery, setSectorQuery] = useState('')
	const [category, setCategory] = useState(searchParams.get('category') || '')
	const [reportType, setReportType] = useState(searchParams.get('reportType') || '')
	const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))

	const countries = useMemo(() => uniqueSorted(companies.map((c) => c.country)), [companies])
	const filteredCountries = countryQuery === '' ? countries : countries.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase()))

	const sectors = useMemo(() => uniqueSorted(companies.map((c) => c.sector)), [companies])
	const filteredSectors = sectorQuery === '' ? sectors : sectors.filter((s) => s.toLowerCase().includes(sectorQuery.toLowerCase()))

	const filteredCompanies = useMemo(() => {
		return companies
			.filter((c) => {
				const searchLower = q.toLowerCase()
				// Safely access nested properties for searching
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
				// 1. Sort by aiReportStatus descending (2, 1, 0)
				if (a.aiReportStatus !== b.aiReportStatus) {
					return b.aiReportStatus - a.aiReportStatus
				}
				// 2. Sort by category ascending (1, 2, 3, 4)
				const categoryA = a.category ?? 99
				const categoryB = b.category ?? 99
				if (categoryA !== categoryB) {
					return categoryA - categoryB
				}
				// 3. Sort by name alphabetically
				return a.name.localeCompare(b.name)
			})
	}, [companies, q, country, sector, category, reportType])

	const ITEMS_PER_PAGE = 50
	const pageCount = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)
	const paginatedCompanies = filteredCompanies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

	useEffect(() => {
		// Update URL params when filters change
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
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
				<div className="relative md:col-span-2">
					<div className="relative">
						<MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							className="w-full rounded-md border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
							placeholder={t('companies.filters.search')}
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
					</div>
				</div>

				<Listbox value={country} onChange={setCountry}>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
							<span className="block truncate">{country || t('companies.filters.country')}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								<Listbox.Option value={null} className={({ active }) => `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}>
									{t('companies.filters.country')}
								</Listbox.Option>
								{filteredCountries.map((c) => (
									<Listbox.Option key={c} value={c} className={({ active }) => `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}>
										{({ selected }) => (
											<>
												<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{c}</span>
												{selected ? (
													<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>

				<Listbox value={sector} onChange={setSector}>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
							<span className="block truncate">{shortenSector(sector || '') || t('companies.filters.sector')}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								<Listbox.Option value={null} className={({ active }) => `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}>
									{t('companies.filters.sector')}
								</Listbox.Option>
								{filteredSectors.map((s) => (
									<Listbox.Option key={s} value={s} className={({ active }) => `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}>
										{({ selected }) => (
											<>
												<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{shortenSector(s)}</span>
												{selected ? (
													<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>

				<Listbox value={category} onChange={(v: string) => setCategory(v)}>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-left shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
							<span className="block truncate">{labelForCategory(category, t) || t('companies.category.all')}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								{[
									['', t('companies.category.all')],
									['1', t('companies.category.c1')],
									['2', t('companies.category.c2')],
									['3', t('companies.category.c3')],
									['4', t('companies.category.c4')],
								].map(([val, label]) => (
									<Listbox.Option
										key={val}
										value={val}
										className={({ active }) => `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}
									>
										{({ selected }) => (
											<>
												<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{label}</span>
												{selected ? (
													<span className="absolute inset-y-0 left-0 flex items-center pl-2 text-primary">
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>

				<Listbox value={reportType} onChange={setReportType}>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
							<span className="block truncate">
								{reportType
									? t(`companies.report_type.${{ '0': 'none', '1': 'basic', '2': 'deep' }[reportType]}`)
									: t('companies.report_type.all')}
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								{[
									['', t('companies.report_type.all')],
									['2', t('companies.report_type.deep')],
									['1', t('companies.report_type.basic')],
									['0', t('companies.report_type.none')],
								].map(([val, label]) => (
									<Listbox.Option
										key={val}
										value={val}
										className={({ active }) => `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}
									>
										{({ selected }) => (
											<>
												<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{label}</span>
												{selected ? (
													<span className="absolute inset-y-0 left-0 flex items-center pl-2 text-primary">
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>
			</div>

			{error && <p className="text-red-600">Error: {error.message}</p>}
			{loading && <p className="text-gray-500">Loading…</p>}
			{!loading && !error && (
				<div>
					{/* Responsive Card Layout */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{paginatedCompanies.map((c) => (
							<Link to={`/companies/${encodeURIComponent(c.id)}`} key={c.id} className="block rounded-lg border border-white/40 bg-white/70 p-4 shadow-sm dark:bg-slate-900/70 hover:shadow-lg transition-shadow">
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
						))}
					</div>

					<div className="flex items-center justify-between p-3 mt-4">
						<button className="px-3 py-1.5 rounded bg-primary text-white disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
							{t('companies.paging.prev')}
						</button>
						<div>
							Page {page} / {pageCount}
						</div>
						<button className="px-3 py-1.5 rounded bg-primary text-white disabled:opacity-40" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>
							{t('companies.paging.next')}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

const th = 'text-left px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-primary/20'
const td = 'px-3 py-3 align-top text-sm text-gray-800 dark:text-gray-100'


