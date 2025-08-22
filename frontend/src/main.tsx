import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import CompaniesPage from './pages/CompaniesPage.tsx'
import CompanyDetailPage from './pages/CompanyDetailPage.tsx'
import OverviewPage from './pages/OverviewPage'
import './index.css'
import './i18n'
import { CompanyProvider } from './contexts/CompanyDataContext'
import MainLayout from './layouts/MainLayout'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				element: <MainLayout />,
				children: [
					{ index: true, element: <OverviewPage /> },
					{ path: 'companies', element: <CompaniesPage /> },
					{ path: 'companies/:id', element: <CompanyDetailPage /> },
				],
			},
		],
	},
])

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
	<React.StrictMode>
		<CompanyProvider>
			<RouterProvider router={router} />
		</CompanyProvider>
	</React.StrictMode>
)


