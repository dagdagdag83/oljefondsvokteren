import React, { Fragment, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { Company } from '../../types'
import { labelForCategory, shortenSector } from '../../utils/utils'

interface CompanyFiltersProps {
	companies: Company[]
	q: string
	setQ: (q: string) => void
	country: string | null
	setCountry: (country: string | null) => void
	sector: string | null
	setSector: (sector: string | null) => void
	category: string
	setCategory: (category: string) => void
	reportType: string
	setReportType: (reportType: string) => void
}

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

export function CompanyFilters({
	companies,
	q,
	setQ,
	country,
	setCountry,
	sector,
	setSector,
	category,
	setCategory,
	reportType,
	setReportType,
}: CompanyFiltersProps) {
	const { t } = useTranslation()
	const [countryQuery, setCountryQuery] = useState('')
	const [sectorQuery, setSectorQuery] = useState('')

	const countries = useMemo(() => uniqueSorted(companies.map((c) => c.country)), [companies])
	const filteredCountries = countryQuery === '' ? countries : countries.filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase()))

	const sectors = useMemo(() => uniqueSorted(companies.map((c) => c.sector)), [companies])
	const filteredSectors = sectorQuery === '' ? sectors : sectors.filter((s) => s.toLowerCase().includes(sectorQuery.toLowerCase()))

	return (
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
	)
}
