import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronUpDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { Company, useCompanyData } from '../shared/useCompanyData'

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function suggest(values: string[]) {
	return uniqueSorted(values).slice(0, 50).map(v => (
		<Combobox.Option key={v} value={v} className={({ active }) => `cursor-default select-none px-3 py-1 ${active ? 'bg-secondary text-gray-900' : 'text-gray-900'}`}>
			{v}
		</Combobox.Option>
	))
}

function labelForCategory(val: string, t?: (k: string) => string) {
	const tr = t ?? ((k: string) => k)
	return val === '4' ? tr('companies.category.c4')
		: val === '3' ? tr('companies.category.c3')
		: val === '2' ? tr('companies.category.c2')
		: val === '1' ? tr('companies.category.c1')
		: tr('companies.category.all')
}

export default function CompaniesPage() {
	const { t } = useTranslation()
	const { companies, loading, error } = useCompanyData()
	const [q, setQ] = useState('')
	const [country, setCountry] = useState('')
	const [sector, setSector] = useState('')
	const [category, setCategory] = useState('')
	const [page, setPage] = useState(1)

	const filteredCompanies = useMemo(() => {
		return companies
			.filter((c) => {
				const searchLower = q.toLowerCase()
				return (
					(c.name.toLowerCase().includes(searchLower) ||
						c.concerns.toLowerCase().includes(searchLower) ||
						c.rationale.toLowerCase().includes(searchLower)) &&
					(!country || c.country.toLowerCase() === country.toLowerCase()) &&
					(!sector || c.sector.toLowerCase() === sector.toLowerCase()) &&
					(!category || c.category.toString() === category)
				)
			})
			.sort((a, b) => b.category - a.category || a.name.localeCompare(b.name))
	}, [companies, q, country, sector, category])

	const pageCount = Math.ceil(filteredCompanies.length / 20)
	const paginatedCompanies = filteredCompanies.slice((page - 1) * 20, page * 20)

	useEffect(() => {
		setPage(1)
	}, [q, country, sector, category])

	return (
		<div className="grid gap-6">
			<h2 className="text-2xl font-semibold tracking-tight">{t('app.companies')}</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
				<div className="relative">
					<MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input className="w-full rounded-md border-gray-300 pl-9 pr-3 py-2 shadow-sm focus:border-primary focus:ring-primary" placeholder={t('companies.filters.search')} value={q} onChange={(e) => setQ(e.target.value)} />
				</div>

				<Combobox value={country} onChange={(v: string) => setCountry(v)}>
					<div className="relative">
						<Combobox.Input
							className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
							displayValue={(v: string) => v}
							placeholder={t('companies.filters.country')}
							onChange={(e) => setCountry(e.target.value)}
						/>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
								{suggest(companies.map((i) => i.country) ?? [])}
							</Combobox.Options>
						</Transition>
					</div>
				</Combobox>

				<Combobox value={sector} onChange={(v: string) => setSector(v)}>
					<div className="relative">
						<Combobox.Input
							className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
							displayValue={(v: string) => v}
							placeholder={t('companies.filters.sector')}
							onChange={(e) => setSector(e.target.value)}
						/>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
								{suggest(companies.map((i) => i.sector) ?? [])}
							</Combobox.Options>
						</Transition>
					</div>
				</Combobox>

				<Listbox value={category} onChange={(v: string) => setCategory(v)}>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-left shadow-sm focus:border-primary focus:ring-primary">
							<span className="block truncate">{labelForCategory(category, t)}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>
						<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
								{[
									['', t('companies.category.all')],
									['4', t('companies.category.c4')],
									['3', t('companies.category.c3')],
									['2', t('companies.category.c2')],
									['1', t('companies.category.c1')],
								].map(([val, label]) => (
									<Listbox.Option key={val} value={val} className={({ active }) => `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-secondary text-gray-900' : 'text-gray-900'}`}>
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
									<td className={td}>{c.country}</td>
									<td className={td}>{c.sector}</td>
									<td className={td}>
										<Badge n={c.category} />
									</td>
									<td className={td}>{c.guideline}</td>
									<td className={td}>{c.concerns}</td>
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

function Badge({ n }: { n: number }) {
	const base = 'inline-block px-2 py-0.5 rounded-full text-sm'
	const cls = n >= 4
		? `${base} bg-red-100 text-red-800`
		: n === 3
		? `${base} bg-orange-100 text-orange-800`
		: n === 2
		? `${base} bg-blue-100 text-blue-800`
		: `${base} bg-emerald-100 text-emerald-800`
	return <span className={cls}>{n}</span>
}

const th = 'text-left px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-primary/20'
const td = 'px-3 py-3 align-top text-sm text-gray-800 dark:text-gray-100'


