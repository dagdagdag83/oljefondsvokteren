import React from 'react'
import { Link, useParams } from 'react-router-dom'
import * as Flags from 'country-flag-icons/react/3x2'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Company, useCompanyData, ShallowReport, DeepReport } from '../shared/useCompanyData'
import { CategoryBadge } from '../shared/CategoryBadge'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { useTranslation } from 'react-i18next'

countries.registerLocale(enLocale)

function labelForCategory(val: string, t: (k: string) => string) {
	return val === '1'
		? t('companies.category.c1')
		: val === '2'
		? t('companies.category.c2')
		: val === '3'
		? t('companies.category.c3')
		: val === '4'
		? t('companies.category.c4')
		: ''
}

const formatToHumanMonetary = (value: number) => {
	if (Math.abs(value) >= 1e12) {
		return `${(value / 1e12).toFixed(1).replace(/\.0$/, '')}Tn`
	}
	if (Math.abs(value) >= 1e9) {
		return `${(value / 1e9).toFixed(1).replace(/\.0$/, '')}Bn`
	}
	if (Math.abs(value) >= 1e6) {
		return `${(value / 1e6).toFixed(1).replace(/\.0$/, '')}M`
	}
	if (Math.abs(value) >= 1e3) {
		return `${(value / 1e3).toFixed(1).replace(/\.0$/, '')}K`
	}
	return value.toString()
}

const getCountryCode = (countryName: string): string | undefined => {
	if (countryName === 'United States') return 'US'
	if (countryName === 'United Kingdom') return 'GB'
	if (countryName.toLowerCase().includes('hong kong')) return 'HK'
	return countries.getAlpha2Code(countryName, 'en')
}

const isDeepReportProfile = (
	profile: DeepReport['companyProfile'] | ShallowReport['companyProfile'],
): profile is DeepReport['companyProfile'] => {
	return 'businessModelAndMarketPosition' in profile
}

const DataPoint: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
	<div>
		<p className="text-sm text-gray-500">{label}</p>
		<p className="text-lg font-semibold">{value || '-'}</p>
	</div>
)

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
	title,
	children,
	className,
}) => (
	<div className={`rounded-lg border border-white/40 bg-white/80 p-4 dark:bg-slate-900/70 ${className}`}>
		<h3 className="text-lg font-medium mb-2">{title}</h3>
		{children}
	</div>
)

const CompanyProfile: React.FC<{ company: Company }> = ({ company }) => {
	const profile = company.deepReport?.companyProfile || company.shallowReport?.companyProfile
	if (!profile) return null

	const countryCode = getCountryCode(company.country)
	const FlagComponent = countryCode ? Flags[countryCode as keyof typeof Flags] : null

	const incorporationCountryCode = company.incorporationCountry && getCountryCode(company.incorporationCountry)
	const IncorporationFlagComponent = incorporationCountryCode
		? Flags[incorporationCountryCode as keyof typeof Flags]
		: null

	return (
		<Section title="Company Profile" className="md:col-span-2">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
				<DataPoint
					label="Country"
					value={
						<span className="flex items-center">
							{FlagComponent && <FlagComponent className="h-4 w-4 mr-2" />}
							{company.country}
						</span>
					}
				/>
				<DataPoint
					label="Incorporation Country"
					value={
						<span className="flex items-center">
							{IncorporationFlagComponent && <IncorporationFlagComponent className="h-4 w-4 mr-2" />}
							{company.incorporationCountry}
						</span>
					}
				/>
				<DataPoint label="Sector" value={company.sector} />
				<DataPoint label="Founded" value={profile.founded} />
			</div>
			<div className="mt-4 space-y-4">
				<div>
					<h4 className="font-medium text-gray-900 dark:text-gray-100">Business Description</h4>
					<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{profile.businessDescription}</p>
				</div>
				{isDeepReportProfile(profile) && (
					<>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100">Business Model & Market Position</h4>
							<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
								{profile.businessModelAndMarketPosition}
							</p>
						</div>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100">
								Global Footprint & Strategic Alliances
							</h4>
							<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
								{profile.globalFootprintAndStrategicAlliances}
							</p>
						</div>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100">Product Portfolio Analysis</h4>
							<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
								{profile.productPortfolioAnalysis}
							</p>
						</div>
					</>
				)}
			</div>
		</Section>
	)
}

const RiskAssessment: React.FC<{ report: ShallowReport | DeepReport }> = ({ report }) => {
	const { t } = useTranslation()
	const risk = report.riskAssessment
	const category = risk.category ? parseInt(risk.category, 10) : undefined
	const categoryString = risk.category || ''

	return (
		<Section title="Risk Assessment" className="md:col-span-2">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<DataPoint
					label="Category"
					value={
						category ? (
							<span className="flex items-center gap-2">
								<CategoryBadge n={category} className="h-8 w-8" />
								<span>{labelForCategory(categoryString, t)}</span>
							</span>
						) : (
							'-'
						)
					}
				/>
				<DataPoint label="Guidelines" value={risk.guidelines?.join(', ') || 'N/A'} />
			</div>

			<div className="space-y-4">
				<div>
					<h4 className="font-medium text-gray-900 dark:text-gray-100">Concerns</h4>
					<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{risk.concerns}</p>
				</div>
				<div>
					<h4 className="font-medium text-gray-900 dark:text-gray-100">Rationale</h4>
					<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{risk.rationale}</p>
				</div>

				{'executiveSummary' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">Executive Summary</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>Purpose & Scope:</strong> {risk.executiveSummary.purposeAndScope}
							</p>
							<p>
								<strong>Key Findings:</strong> {risk.executiveSummary.keyFindings}
							</p>
							<p>
								<strong>Recommendation:</strong> {risk.executiveSummary.recommendation}
							</p>
						</div>
					</>
				)}

				{'productBasedAssessment' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">Product-Based Assessment</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>Summary:</strong> {risk.productBasedAssessment.summary}
							</p>
							<p>
								<strong>Weapons Violation Risk:</strong> {risk.productBasedAssessment.weaponsViolationRisk}
							</p>
							<p>
								<strong>Cannabis Risk:</strong> {risk.productBasedAssessment.cannabisRisk}
							</p>
							<p>
								<strong>Thermal Coal Risk:</strong> {risk.productBasedAssessment.thermalCoalRisk}
							</p>
							<p>
								<strong>Tobacco Production Risk:</strong> {risk.productBasedAssessment.tobaccoProductionRisk}
							</p>
						</div>
					</>
				)}

				{'conductBasedAssessment' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">Conduct-Based Assessment</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>Human Rights Violations:</strong> {risk.conductBasedAssessment.humanRightsViolations}
							</p>
							<p>
								<strong>Rights in War or Conflict:</strong> {risk.conductBasedAssessment.rightsInWarOrConflict}
							</p>
							<p>
								<strong>Environmental Damage:</strong> {risk.conductBasedAssessment.environmentalDamage}
							</p>
							<p>
								<strong>Weapons Sales:</strong> {risk.conductBasedAssessment.weaponsSales}
							</p>
							<p>
								<strong>Corruption & Ethical Norms:</strong> {risk.conductBasedAssessment.corruptionAndEthicalNorms}
							</p>
						</div>
					</>
				)}

				{'geopoliticalRiskExposure' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">Geopolitical Risk Exposure</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>Russia-Ukraine Conflict:</strong> {risk.geopoliticalRiskExposure.russiaUkraineConflict}
							</p>
							<p>
								<strong>Israeli-Palestinian Conflict:</strong> {risk.geopoliticalRiskExposure.israeliPalestinianConflict}
							</p>
							<p>
								<strong>Supply Chain (China) Exposure:</strong> {risk.geopoliticalRiskExposure.supplyChainChinaExposure}
							</p>
							<p>
								<strong>Inconsistent Ethical Postures:</strong> {risk.geopoliticalRiskExposure.inconsistentEthicalPostures}
							</p>
						</div>
					</>
				)}

				{'finalRiskSynthesis' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">Final Risk Synthesis</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>Synthesis of Findings:</strong> {risk.finalRiskSynthesis.synthesisOfFindings}
							</p>
							<p>
								<strong>Weighing of Factors:</strong> {risk.finalRiskSynthesis.weighingOfFactors}
							</p>
							<p>
								<strong>Final Categorization Justification:</strong>{' '}
								{risk.finalRiskSynthesis.finalCategorizationJustification}
							</p>
						</div>
					</>
				)}
			</div>
		</Section>
	)
}

export default function CompanyDetailPage() {
	const { id } = useParams<{ id: string }>()
	const { companies, loading, error } = useCompanyData()
	const { t } = useTranslation()

	const company = companies.find((c) => c.id === id)

	if (loading) return <p className="text-gray-500">Loading…</p>
	if (error) return <p className="text-red-600">Error: {error.message}</p>
	if (!company) return <p className="text-red-600">Company not found</p>

	const report = company.deepReport || company.shallowReport
	const profile = company.deepReport?.companyProfile || company.shallowReport?.companyProfile

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<Link className="text-blue-700 hover:underline dark:text-blue-400" to="/companies">
					← Back to companies
				</Link>
			</div>

			<h2 className="text-3xl font-bold tracking-tight">{company.name}</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2 space-y-8">
					<CompanyProfile company={company} />
					{report && <RiskAssessment report={report} />}
				</div>

				<div className="space-y-4">
					<Section title="Investment Snapshot">
						<div className="space-y-4">
							<DataPoint
								label="Market Value (NOK)"
								value={`${new Intl.NumberFormat('nb-NO').format(company.marketValueNok)} (${formatToHumanMonetary(
									company.marketValueNok,
								)})`}
							/>
							<div className="grid grid-cols-2 gap-4">
								<DataPoint label="Ownership %" value={`${company.ownership}%`} />
								{company.voting && <DataPoint label="Voting %" value={`${company.voting}%`} />}
							</div>
							{profile && (
								<div className="grid grid-cols-2 gap-4">
									<DataPoint label="Ticker" value={profile.ticker} />
									<DataPoint label="Exchange" value={profile.exchange} />
								</div>
							)}
						</div>
					</Section>

					{company.deepReport ? (
						<Section title="Deep Research Report">
							<p className="mb-4">A deep-dive AI analysis has been conducted for this company.</p>
							<div className="flex justify-end">
								<a
									href={`/reports/${company.id}.pdf`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/80"
								>
									View Full Report (PDF)
								</a>
							</div>
						</Section>
					) : (
						<div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
							<div className="flex">
								<div className="flex-shrink-0">
									<InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
										Deep AI Analysis Not Completed
									</h3>
									<div className="mt-2 text-sm text-yellow-700 dark:text-yellow-100">
										<p>A full analysis for this company is pending.</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}


