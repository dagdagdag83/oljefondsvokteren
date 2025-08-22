import { useEffect, useState } from 'react'
import { Company } from '../types'

type Stats = {
	total: number
	totalValue: number
	by_category: Record<string, number>
	by_country: Record<string, number>
	by_sector: Record<string, number>
	top_investments: Company[]
	value_by_sector: Record<string, number>
	value_by_country: Record<string, number>
	high_risk_value_by_sector: Record<string, number>
	high_risk_value_by_country: Record<string, number>
}

export function useOverviewStats(companies: Company[]) {
	const [stats, setStats] = useState<Stats | null>(null)

	useEffect(() => {
		if (companies.length > 0) {
			const byCategory: Record<string, number> = {}
			const byCountry: Record<string, number> = {}
			const bySector: Record<string, number> = {}
			const valueBySector: Record<string, number> = {}
			const valueByCountry: Record<string, number> = {}
			const highRiskValueBySector: Record<string, number> = {}
			const highRiskValueByCountry: Record<string, number> = {}
			let totalValue = 0

			for (const c of companies) {
				const category = c.category?.toString()
				if (category) {
					byCategory[category] = (byCategory[category] || 0) + 1
				}
				byCountry[c.country] = (byCountry[c.country] || 0) + 1
				bySector[c.sector] = (bySector[c.sector] || 0) + 1
				if (c.marketValueNok) {
					totalValue += c.marketValueNok
					valueBySector[c.sector] = (valueBySector[c.sector] || 0) + c.marketValueNok
					valueByCountry[c.country] = (valueByCountry[c.country] || 0) + c.marketValueNok
					if (c.category === 1 || c.category === 2) {
						highRiskValueBySector[c.sector] = (highRiskValueBySector[c.sector] || 0) + c.marketValueNok
						highRiskValueByCountry[c.country] = (highRiskValueByCountry[c.country] || 0) + c.marketValueNok
					}
				}
			}

			const topInvestments = [...companies]
				.sort((a, b) => (b.marketValueNok || 0) - (a.marketValueNok || 0))
				.slice(0, 10)

			setStats({
				total: companies.length,
				totalValue: totalValue,
				by_category: byCategory,
				by_country: byCountry,
				by_sector: bySector,
				top_investments: topInvestments,
				value_by_sector: valueBySector,
				value_by_country: valueByCountry,
				high_risk_value_by_sector: highRiskValueBySector,
				high_risk_value_by_country: highRiskValueByCountry,
			})
		}
	}, [companies])

	return stats
}
