import { useEffect, useState } from 'react'
import { Link, Outlet, NavLink } from 'react-router-dom'
import { useTheme } from './shared/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import Flags from 'country-flag-icons/react/3x2'
import { useCompanyData } from './shared/useCompanyData'

type HealthResponse = { status: string }

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
						<img src={`${import.meta.env.BASE_URL}ov_logo.png`} alt="Oljefondsvokteren" className="h-28 object-contain" />
						<span className="text-xl font-semibold tracking-tight text-white">{t('app.title')}</span>
					</Link>
					<nav className="flex gap-4">
						<NavLink to="/" end className={({ isActive }) => (isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white')}>
							{t('app.overview')}
						</NavLink>
						<NavLink to="/companies" className={({ isActive }) => (isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white')}>
							{t('app.companies')}
						</NavLink>
					</nav>
					<div className="ml-auto text-sm text-white/90 flex items-center gap-3">
						<span className={`px-2 py-0.5 rounded-full text-white ${companiesLoading ? 'bg-yellow-500/50' : companiesError ? 'bg-red-500/50' : 'bg-accentGreen/20'}`}>
							{companiesLoading ? 'Loading data...' : companiesError ? 'Data error' : 'Data loaded'}
						</span>
						{error && <span className="ml-3 text-red-200">Error: {error}</span>}
						<button onClick={toggleTheme} className="inline-flex items-center gap-1 rounded border border-white/30 bg-white/10 px-2 py-1 text-sm text-white hover:bg-white/20">
							{theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
							{theme === 'dark' ? 'Light' : 'Dark'}
						</button>
						<div className="relative ml-2">
							<select
								aria-label="Language"
								value={i18n.language.split('-')[0]}
								onChange={(e) => {
									i18n.changeLanguage(e.target.value)
									localStorage.setItem('lang', e.target.value)
								}}
								className="appearance-none rounded-md border border-white/30 bg-white py-1 pl-8 pr-2 text-primary focus:outline-none focus:ring-2 focus:ring-white/50"
							>
								<option value="en">English</option>
								<option value="no">Norsk</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
								{i18n.language.startsWith('no') ? (
									<Flags.NO title="Norsk" className="h-4 w-4" />
								) : (
									<Flags.GB title="English" className="h-4 w-4" />
								)}
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="container py-6 text-gray-900 dark:text-slate-100">
				<Outlet />
			</main>

			<footer className="border-t border-primary/20 mt-8 py-4 text-sm text-gray-600 dark:text-gray-400">
				<div className="container">Oljefondsvokteren</div>
			</footer>
		</div>
	)
}


