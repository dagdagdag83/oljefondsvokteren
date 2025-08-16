import { useState, useEffect } from 'react'
import Papa from 'papaparse'

// Utility to generate a slug from a name
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

// New robust parsing function
const parseRobustFloat = (value: string | undefined | null): number => {
	if (!value) return 0
	const cleanedString = String(value).replace(/ /g, '').replace(',', '.')
	if (cleanedString === '') return 0
	const num = parseFloat(cleanedString)
	return isNaN(num) ? 0 : num
}

export interface Company {
	id: string
	name: string
	country: string
	sector: string
	marketValue: number
	ownership: number
	voting?: number
	incorporationCountry?: string
	concerns?: string
	guideline?: string
	category?: number
	rationale?: string
	aiReportStatus: number // 0: none, 1: basic, 2: full
	detailedReport?: any
}

export function useCompanyData() {
	const [companies, setCompanies] = useState<Company[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		async function fetchData() {
			try {
				// Fetch both files
				const [holdingsRes, enrichRes] = await Promise.all([
					fetch(`${import.meta.env.BASE_URL}data/EQ_2025_06_30_Industry.csv`),
					fetch(`${import.meta.env.BASE_URL}data/investments.json`),
				])

				if (!holdingsRes.ok || !enrichRes.ok) {
					throw new Error('Network response was not ok')
				}

				const holdingsCsv = await holdingsRes.text()
				const enrichData = await enrichRes.json()

				// Create a map of enrichment data for quick lookup
				const enrichmentMap = new Map(enrichData.map((item: any) => [item.id, item]))

				// Parse the CSV
				Papa.parse(holdingsCsv, {
					header: true,
					skipEmptyLines: true,
					delimiter: ';',
					complete: (results) => {
						const holdings = results.data
							.map((row: any) => {
								const name = row['Name']
								if (!name) return null // Skip rows without a name

								const id = slugify(name)
								const enriched = enrichmentMap.get(id) || {}

								return {
									id: id,
									name: name,
									country: row['Country'],
									sector: row['Industry'],
									marketValue: parseRobustFloat(row['Market Value(NOK)']),
									ownership: parseRobustFloat(row['Ownership']),
									voting: parseRobustFloat(row['Voting']),
									incorporationCountry: row['Incorporation Country'],
									...enriched,
									aiReportStatus: enriched.aiReportStatus ?? (enriched.detailedReport ? 2 : enriched.name ? 1 : 0),
								}
							})
							.filter((c) => c !== null) as Company[] // Filter out any nulls

						setCompanies(holdings)
					},
					error: (err) => {
						setError(err as Error)
					},
				})
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
