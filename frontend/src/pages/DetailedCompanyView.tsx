import React from 'react'
import { Link } from 'react-router-dom';

export function DetailedCompanyView({ data }: { data: any }) {
	return (
		<div className="prose dark:prose-invert max-w-none">
			<h1>{data.companyProfile.name}</h1>
			<p>{data.companyProfile.businessDescription}</p>

			<h2>ESG Assessment Summary</h2>
			<p>
				<strong>Final Risk Category:</strong> {data.esgAssessmentSummary.finalRiskCategory}
			</p>
			<p>{data.esgAssessmentSummary.executiveSummary}</p>

			<h2>Detailed Risk Analysis</h2>
			<ul>
				{data.detailedRiskAnalysis.map((item: any, index: number) => (
					<li key={index}>
						<strong>{item.criterion}:</strong> {item.riskLevel} - {item.findings}
					</li>
				))}
			</ul>

			<h2>Product Analysis</h2>
			<p>
				<strong>Portfolio Overview:</strong> {data.productAnalysis.portfolioOverview}
			</p>
			<p>
				<strong>Dual-Use Nature:</strong> {data.productAnalysis.dualUseNature}
			</p>

			<h2>Geopolitical Exposure</h2>
			<h3>Russia-Ukraine Conflict</h3>
			<p>
				<strong>Stance:</strong> {data.geopoliticalExposure.russiaUkraineConflict.stance}
			</p>
			<p>{data.geopoliticalExposure.russiaUkraineConflict.actions}</p>

			<h3>Israeli-Palestinian Conflict</h3>
			<p>
				<strong>Stance:</strong> {data.geopoliticalExposure.israeliPalestinianConflict.stance}
			</p>
			<p>{data.geopoliticalExposure.israeliPalestinianConflict.actions}</p>

			<Link to="/companies/melexis-nv/full-report" className="text-blue-600 hover:underline">
				View full Gemini research report
			</Link>
		</div>
	)
}
