import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export default function MainLayout() {
	return (
		<div className="min-h-screen bg-secondary text-gray-900 dark:bg-slate-950 dark:text-slate-100">
			<Header />
			<main className="container py-6 text-gray-900 dark:text-slate-100">
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}
