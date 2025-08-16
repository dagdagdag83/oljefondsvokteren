import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked, slugify, stripMarkdownFormatting } from '../shared/marked'

export function CompanyFullReportPage() {
	const { id } = useParams<{ id: string }>()
	const [reportHtml, setReportHtml] = useState('')
	const [headings, setHeadings] = useState<{ text: string; slug: string }[]>([])
	const [error, setError] = useState('')

	useEffect(() => {
		if (!id) return

		async function fetchReport() {
			try {
				const response = await fetch(`${import.meta.env.BASE_URL}reports/${id}.md`)
				if (!response.ok) {
					throw new Error('Report not found')
				}
				const markdown = await response.text()

				// Extract H2 headings for Table of Contents
				const headingRegex = /^## (.*$)/gim
				const extractedHeadings = []
				let match
				while ((match = headingRegex.exec(markdown)) !== null) {
					const cleanText = stripMarkdownFormatting(match[1])
					extractedHeadings.push({ text: cleanText, slug: slugify(cleanText) })
				}
				setHeadings(extractedHeadings)

				const html = await marked(markdown)
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
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<aside className="col-span-1 sticky top-24 self-start">
					<nav>
						<h3 className="font-semibold text-lg mb-4">Contents</h3>
						<ul className="space-y-2">
							{headings.map((heading) => (
								<li key={heading.slug}>
									<a href={`#${heading.slug}`} className="hover:underline text-gray-700 dark:text-gray-300">
										{heading.text}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</aside>
				<main className="col-span-3">
					<div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: reportHtml }} />
				</main>
			</div>
		</div>
	)
}
