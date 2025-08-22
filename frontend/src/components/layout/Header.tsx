import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { useCompanyData } from '../../hooks/useCompanyData'
import { LanguageSelector } from '../LanguageSelector'
import { Breadcrumbs } from './Breadcrumbs'

export function Header() {
	const [theme, toggleTheme] = useTheme()
	const { t } = useTranslation()
	const { loading: companiesLoading, error: companiesError } = useCompanyData()

	return (
		<header className="bg-primary shadow-md">
			<div className="container py-3 flex flex-wrap items-center justify-between gap-y-2">
				<Link to="/" className="flex items-center gap-3">
					<img src={`${import.meta.env.BASE_URL}ov_logo.png`} alt="Oljefondsvokteren" className="h-12 md:h-16 object-contain" />
					<span className="text-lg md:text-xl font-semibold tracking-tight text-white">{t('app.title')}</span>
				</Link>
				<div className="hidden md:flex ml-6">
					<Breadcrumbs />
				</div>
				<div className="ml-auto text-sm text-white/90 flex items-center gap-2 md:gap-3">
					{companiesLoading && (
						<span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-white text-xs bg-yellow-500/50">
							Loading data...
						</span>
					)}
					{companiesError && (
						<span
							className="hidden sm:inline-block px-2 py-0.5 rounded-full text-white text-xs bg-red-500/50"
							title={companiesError.message}
						>
							Data error
						</span>
					)}
					<button
						onClick={toggleTheme}
						className="inline-flex items-center gap-1 rounded border border-white/30 bg-white/10 px-2 py-1 text-sm text-white hover:bg-white/20"
					>
						{theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
						<span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
					</button>
					<LanguageSelector />
				</div>
			</div>
		</header>
	)
}
