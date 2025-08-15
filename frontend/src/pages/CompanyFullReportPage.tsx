import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export function CompanyFullReportPage() {
	const { id } = useParams<{ id: string }>()
	const [reportHtml, setReportHtml] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (!id) return

		async function fetchReport() {
			try {
				const response = await fetch(`${import.meta.env.BASE_URL}full-reports/${id}.html`)
				if (!response.ok) {
					throw new Error('Report not found')
				}
				const html = await response.text()
				setReportHtml(html)
			} catch (err) {
				setError((err as Error).message)
			}
		}

		fetchReport()
	}, [id])

	if (error) {
		return (
			<div>
				<p className="text-red-600">{error}</p>
				<Link to="/companies" className="text-blue-600 hover:underline">
					← Back to companies
				</Link>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<Link to={`/companies/${id}`} className="text-blue-700 hover:underline dark:text-blue-400">
				← Back to Company Summary
			</Link>
			<div className="grid grid-cols-4 gap-8">
				<aside className="col-span-1 sticky top-24 self-start">
					<nav>
						<h3 className="font-semibold text-lg mb-4">Contents</h3>
						<ul className="space-y-2">
							<li>
								<a href="#summary" className="hover:underline">
									Executive Summary
								</a>
							</li>
							<li>
								<a href="#profile" className="hover:underline">
									Corporate Profile
								</a>
							</li>
							<li>
								<a href="#product-criteria" className="hover:underline">
									Product-Based Criteria (§ 3)
								</a>
							</li>
							<li>
								<a href="#conduct-criteria" className="hover:underline">
									Conduct-Based Criteria (§ 4)
								</a>
							</li>
							<li>
								<a href="#geopolitical" className="hover:underline">
									Geopolitical Risk
								</a>
							</li>
							<li>
								<a href="#synthesis" className="hover:underline">
									Final Synthesis
								</a>
							</li>
						</ul>
					</nav>
				</aside>
				<main className="col-span-3" dangerouslySetInnerHTML={{ __html: reportHtml }} />
			</div>
		</div>
	)
}
