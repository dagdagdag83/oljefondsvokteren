import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { useTheme } from './shared/useTheme'
import { MoonIcon, SunIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import Flags from 'country-flag-icons/react/3x2'
import { useCompanyData } from './shared/useCompanyData'
import { LanguageSelector } from './shared/LanguageSelector'

type HealthResponse = { status: string }

function Breadcrumbs() {
	const location = useLocation()
	const params = useParams()
	const { t } = useTranslation()
	const { companies } = useCompanyData()
	const pathnames = location.pathname.split('/').filter((x) => x)

	const crumbs = pathnames.map((value, index) => {
		const to = `/${pathnames.slice(0, index + 1).join('/')}`
		let label = value.charAt(0).toUpperCase() + value.slice(1)

		if (value === 'companies') {
			label = t('app.companies', 'Companies')
		} else if (params.id && value === params.id) {
			const company = companies.find((c) => c.id === params.id)
			if (company) {
				label = company.name
			}
		} else if (value === 'report') {
			label = t('app.full_report', 'Full Report')
		}

		return { to, label }
	})

	return (
		<nav className="flex items-center text-sm text-white/80">
			<Link to="/" className="hover:text-white">
				{t('app.overview')}
			</Link>
			{crumbs.map((crumb, index) => (
				<React.Fragment key={crumb.to}>
					<ChevronRightIcon className="h-4 w-4 mx-1" />
					<Link to={crumb.to} className={index === crumbs.length - 1 ? 'font-semibold text-white' : 'hover:text-white'}>
						{crumb.label}
					</Link>
				</React.Fragment>
			))}
		</nav>
	)
}

export default function App() {
	const [error, setError] = useState<string>('')
	const [theme, toggleTheme] = useTheme()
	const { t, i18n } = useTranslation()
	const { loading: companiesLoading, error: companiesError } = useCompanyData()

	useEffect(() => {
		// Health check is no longer needed, but we can check for data loading errors
		if (companiesError) {
			setError(companiesError.message)
		}
	}, [companiesError])

	return (
		<div className="min-h-screen bg-secondary text-gray-900 dark:bg-slate-950 dark:text-slate-100">
			<header className="bg-primary shadow-md">
				<div className="container py-3 flex items-center">
					<Link to="/" className="flex items-center gap-3">
						<img src={`${import.meta.env.BASE_URL}ov_logo.png`} alt="Oljefondsvokteren" className="h-16 object-contain" />
						<span className="text-xl font-semibold tracking-tight text-white">{t('app.title')}</span>
					</Link>
					<div className="ml-6">
						<Breadcrumbs />
					</div>
					<div className="ml-auto text-sm text-white/90 flex items-center gap-3">
						<span
							className={`px-2 py-0.5 rounded-full text-white ${
								companiesLoading ? 'bg-yellow-500/50' : companiesError ? 'bg-red-500/50' : 'bg-accentGreen/20'
							}`}
						>
							{companiesLoading ? 'Loading data...' : companiesError ? 'Data error' : 'Data loaded'}
						</span>
						{error && <span className="ml-3 text-red-200">Error: {error}</span>}
						<button onClick={toggleTheme} className="inline-flex items-center gap-1 rounded border border-white/30 bg-white/10 px-2 py-1 text-sm text-white hover:bg-white/20">
							{theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
							{theme === 'dark' ? 'Light' : 'Dark'}
						</button>
						<LanguageSelector />
					</div>
				</div>
			</header>

			<main className="container py-6 text-gray-900 dark:text-slate-100">
				<Outlet />
			</main>

			<footer className="border-t border-primary/20 mt-8 py-6 text-sm text-gray-600 dark:text-gray-400">
				<div className="container text-center">
					<p className="font-semibold">Oljefondsvokteren created by Dag Sneeggen</p>
					<div className="flex justify-center gap-4 my-2">
						<a href="https://dag.quest" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
							dag@quest
						</a>
						<a href="https://linkedin.com/in/dags83" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
							dag@linkedin
						</a>
					</div>
					<p className="text-xs text-gray-500">
						Vibe-coded with my BFFs Cursor & Google Gemini{' '}
						<span role="img" aria-label="diamond">
							🔷
						</span>
					</p>
					<a
						href="https://github.com/dagdagdag83/oljefondsvokteren"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primary text-xs"
					>
						oljefondsvokteren@github
					</a>
				</div>
			</footer>
		</div>
	)
}


