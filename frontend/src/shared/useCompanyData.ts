import { useState, useEffect } from 'react'

export interface Company {
	id: string
	name: string
	country: string
	sector: string
	concerns: string
	guideline: string
	category: number
	rationale: string
}

export function useCompanyData() {
	const [companies, setCompanies] = useState<Company[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/data/investments.json')
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				const data = await response.json()
				// Simple slugify function for IDs
				const slugify = (text: string) =>
					text
						.toString()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.toLowerCase()
						.trim()
						.replace(/\s+/g, '-')
						.replace(/[^\w-]+/g, '')
						.replace(/--+/g, '-')
				setCompanies(
					data.map((c: any) => ({
						...c,
						id: slugify(c.name),
					}))
				)
			} catch (error) {
				setError(error as Error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return { companies, loading, error }
}
