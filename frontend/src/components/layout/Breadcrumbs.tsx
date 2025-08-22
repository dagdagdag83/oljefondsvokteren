import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCompanyData } from '../../hooks/useCompanyData'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export function Breadcrumbs() {
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
