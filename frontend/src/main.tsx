import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import CompaniesPage from './pages/CompaniesPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import OverviewPage from './pages/OverviewPage'
import { MelexisFullReport } from './pages/MelexisFullReport'
import './index.css'
import './i18n'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <OverviewPage /> },
			{ path: 'companies', element: <CompaniesPage /> },
			{ path: 'companies/:id', element: <CompanyDetailPage /> },
			{ path: 'companies/melexis-nv/full-report', element: <MelexisFullReport /> },
		],
	},
])

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)


