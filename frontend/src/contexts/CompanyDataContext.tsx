import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Company } from '../types'

interface CompanyDataContextType {
	companies: Company[]
	loading: boolean
	error: Error | null
}

const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined)

// Helper to determine AI report status
const getAiReportStatus = (company: any): number => {
	if (company.state === 'done_deep' && company.deepReport) {
		return 2 // Full report
	}
	if (company.state === 'done_shallow' && company.shallowReport) {
		return 1 // Shallow report
	}
	return 0 // No report
}

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
	const [companies, setCompanies] = useState<Company[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch(`${import.meta.env.BASE_URL}data/investments_exported.json`)

				if (!res.ok) {
					throw new Error('Network response was not ok')
				}

				const data = await res.json()

				const transformedCompanies = data.map(
					(item: any): Company => {
						const shallowReport = item.shallowReport
						const deepReport = item.deepReport

						let category: number | undefined
						if (deepReport && deepReport.riskAssessment) {
							category = parseInt(deepReport.riskAssessment.category, 10)
						} else if (shallowReport && shallowReport.riskAssessment) {
							category = parseInt(shallowReport.riskAssessment.category, 10)
						}

						return {
							id: item.id,
							name: item.name,
							country: item.country,
							sector: item.industry, // Assuming 'industry' maps to 'sector'
							marketValueNok: parseFloat(String(item.marketValueNok).replace(/ /g, '')) || 0,
							ownership: parseFloat(String(item.ownership).replace(',', '.')) || 0,
							voting: parseFloat(String(item.voting).replace(',', '.')) || 0,
							incorporationCountry: item.incorporationCountry,
							state: item.state,
							shallowReport: shallowReport,
							deepReport: deepReport,
							aiReportStatus: getAiReportStatus(item),
							category: category,
						}
					},
				)

				setCompanies(transformedCompanies)
			} catch (error) {
				setError(error as Error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return <CompanyDataContext.Provider value={{ companies, loading, error }}>{children}</CompanyDataContext.Provider>
}

export const useCompanyData = () => {
	const context = useContext(CompanyDataContext)
	if (context === undefined) {
		throw new Error('useCompanyData must be used within a CompanyProvider')
	}
	return context
}
