import { useState, useEffect } from 'react'

export interface Company {
	id: string
	name: string
	country: string
	sector: string
	marketValueNok: number
	ownership: number
	voting?: number
	incorporationCountry?: string
	state: string
	shallowReport?: ShallowReport
	deepReport?: DeepReport
	aiReportStatus: number
	category?: number
}

export interface ShallowReport {
	companyProfile: {
		headquarters: string
		ticker: string
		founded: number
		sector: string
		exchange: string
		businessDescription: string
	}
	riskAssessment: {
		category: string
		concerns: string
		guidelines: string[]
		rationale: string
	}
}

export interface DeepReport {
	assessmentDate: string
	riskAssessment: {
		productBasedAssessment: {
			cannabisRisk: string
			summary: string
			thermalCoalRisk: string
			weaponsViolationRisk: string
			tobaccoProductionRisk: string
		}
		executiveSummary: {
			keyFindings: string
			recommendation: string
			purposeAndScope: string
		}
		geopoliticalRiskExposure: {
			inconsistentEthicalPostures: string
			russiaUkraineConflict: string
			supplyChainChinaExposure: string
			israeliPalestinianConflict: string
		}
		rationale: string
		conductBasedAssessment: {
			rightsInWarOrConflict: string
			weaponsSales: string
			environmentalDamage: string
			humanRightsViolations: string
			corruptionAndEthicalNorms: string
		}
		category: string
		concerns: string
		guidelines: string[]
		finalRiskSynthesis: {
			finalCategorizationJustification: string
			weighingOfFactors: string
			synthesisOfFindings: string
		}
	}
	companyProfile: {
		ticker: string
		founded: number
		sector: string
		businessModelAndMarketPosition: string
		globalFootprintAndStrategicAlliances: string
		headquarters: string
		productPortfolioAnalysis: string
		businessDescription: string
		exchange: string
	}
	companyName: string
}

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

export function useCompanyData() {
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

	return { companies, loading, error }
}
