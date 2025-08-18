import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, MagnifyingGlassIcon, DocumentCheckIcon, DocumentIcon, DocumentMinusIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { Company, useCompanyData } from '../shared/useCompanyData'
import * as Flags from 'country-flag-icons/react/3x2'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale)

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

const getCountryCode = (countryName: string): string | undefined => {
	if (countryName === 'United States') return 'US'
	if (countryName === 'United Kingdom') return 'GB'
	if (countryName.toLowerCase().includes('hong kong')) return 'HK'
	return countries.getAlpha2Code(countryName, 'en')
}

function labelForCategory(val: string, t?: (k: string) => string) {
	const tr = t ?? ((k: string) => k)
	return val === '4'
		? tr('companies.category.c4')
		: val === '3'
		? tr('companies.category.c3')
		: val === '2'
		? tr('companies.category.c2')
		: val === '1'
		? tr('companies.category.c1')
		: tr('companies.category.all')
}

function truncate(str: string, length: number): string {
	if (str.length <= length) {
		return str
	}
	return str.slice(0, length) + '…'
}

export default function CompaniesPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const [searchParams, setSearchParams] = useSearchParams()

	const [q, setQ] = useState(searchParams.get('q') || '')
	const [country, setCountry] = useState(searchParams.get('country') || '')
	const [countryQuery, setCountryQuery] = useState('')
	const [sector, setSector] = useState(searchParams.get('sector') || '')
	const [sectorQuery, setSectorQuery] = useState('')
	const [category, setCategory] = useState(searchParams.get('category') || '')
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
					(!category || (c.category && c.category.toString() === category))
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
	}, [companies, q, country, sector, category])

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
		if (page > 1) params.set('page', page.toString())
		setSearchParams(params)
	}, [q, country, sector, category, page, setSearchParams])

	useEffect(() => {
		setPage(1)
	}, [q, country, sector, category])

	return (
		<div className="grid gap-6 px-8 sm:px-12 lg:px-16">
			<h2 className="text-2xl font-semibold tracking-tight">{t('app.companies')}</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
				<div className="relative">
					<MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						className="w-full rounded-md border-gray-300 bg-white pl-9 pr-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
						placeholder={t('companies.filters.search')}
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
				</div>

				<Combobox value={country} onChange={setCountry}>
					<div className="relative">
						<Combobox.Input
							className="w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
							displayValue={(v: string) => v}
							placeholder={t('companies.filters.country')}
							onChange={(e) => setCountryQuery(e.target.value)}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</Combobox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setCountryQuery('')}>
							<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								{filteredCountries.length === 0 && countryQuery !== '' ? (
									<div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-200">Nothing found.</div>
								) : (
									filteredCountries.map((c) => (
										<Combobox.Option key={c} value={c} className={({ active }) => `cursor-default select-none px-3 py-1 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}>
											{c}
										</Combobox.Option>
									))
								)}
							</Combobox.Options>
						</Transition>
					</div>
				</Combobox>

				<Combobox value={sector} onChange={setSector}>
					<div className="relative">
						<Combobox.Input
							className="w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
							displayValue={(v: string) => v}
							placeholder={t('companies.filters.sector')}
							onChange={(e) => setSectorQuery(e.target.value)}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</Combobox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setSectorQuery('')}>
							<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								{filteredSectors.length === 0 && sectorQuery !== '' ? (
									<div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-200">Nothing found.</div>
								) : (
									filteredSectors.map((s) => (
										<Combobox.Option key={s} value={s} className={({ active }) => `cursor-default select-none px-3 py-1 ${active ? 'bg-secondary text-gray-900 dark:bg-slate-700 dark:text-slate-100' : 'text-gray-900 dark:text-slate-100'}`}>
											{s}
										</Combobox.Option>
									))
								)}
							</Combobox.Options>
						</Transition>
					</div>
				</Combobox>

				<Listbox value={category} onChange={(v: string) => setCategory(v)}>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-left shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
							<span className="block truncate">{labelForCategory(category, t)}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-slate-800 dark:ring-white/10">
								{[
									['', t('companies.category.all')],
									['4', t('companies.category.c4')],
									['3', t('companies.category.c3')],
									['2', t('companies.category.c2')],
									['1', t('companies.category.c1')],
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
				<div className="rounded-lg border border-white/40 overflow-hidden bg-white/70 backdrop-blur dark:bg-slate-900/70">
					<table className="w-full border-collapse">
						<thead className="text-left">
							<tr className="bg-white/60 dark:bg-slate-900/60">
								<th className={th}>{t('companies.columns.name')}</th>
								<th className={th}>{t('companies.columns.country')}</th>
								<th className={th}>{t('companies.columns.sector')}</th>
								<th className={th}>{t('companies.columns.category')}</th>
								<th className={th}>{t('companies.columns.guideline')}</th>
								<th className={th}>{t('companies.columns.concerns')}</th>
								<th className={th}>{t('companies.columns.ai_report')}</th>
							</tr>
						</thead>
						<tbody>
							{paginatedCompanies.map((c, idx) => (
								<tr key={c.id} className={idx % 2 === 0 ? 'bg-white/60 dark:bg-slate-900/60' : ''}>
									<td className={td}>
										<Link className="hover:underline text-primary dark:text-blue-300" to={`/companies/${encodeURIComponent(c.id)}`}>
											{c.name}
										</Link>
									</td>
									<td className={td}>
										<span className="flex items-center">
											{React.createElement(Flags[getCountryCode(c.country) as keyof typeof Flags], {
												className: 'h-4 w-4 mr-2',
											})}
											{c.country}
										</span>
									</td>
									<td className={td}>{c.sector}</td>
									<td className={td}>{c.category ? <Badge n={c.category} /> : '-'}</td>
									<td className={td}>
										{truncate(
											(c.deepReport?.riskAssessment?.guidelines || c.shallowReport?.riskAssessment?.guidelines)?.join(', ') || '-',
											200,
										)}
									</td>
									<td className={td}>
										{truncate(c.deepReport?.riskAssessment?.concerns || c.shallowReport?.riskAssessment?.concerns || '-', 200)}
									</td>
									<td className={td}>
										{c.aiReportStatus === 2 && <DocumentCheckIcon className="h-6 w-6 text-accentGreen" title="Full AI Research Report" />}
										{c.aiReportStatus === 1 && <DocumentIcon className="h-6 w-6 text-yellow-500" title="Basic AI Report" />}
										{c.aiReportStatus === 0 && <DocumentMinusIcon className="h-6 w-6 text-gray-400" title="No AI Report" />}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex items-center justify-between p-3">
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

export function Badge({ n }: { n: number }) {
	const base = 'inline-flex items-center justify-center h-6 w-6 rounded-full text-sm font-semibold'
	const cls =
		n === 1
			? `${base} bg-red-400 text-white`
			: n === 2
			? `${base} bg-orange-400 text-white`
			: n === 3
			? `${base} bg-yellow-400 text-gray-900`
			: `${base} bg-green-400 text-white`
	return <span className={cls}>{n}</span>
}

const th = 'text-left px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-primary/20'
const td = 'px-3 py-3 align-top text-sm text-gray-800 dark:text-gray-100'


