import React from 'react'
import { Link, useParams } from 'react-router-dom'
import * as Flags from 'country-flag-icons/react/3x2'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useCompanyData } from '../hooks/useCompanyData'
import { Company, ShallowReport, DeepReport } from '../types'
import { CategoryBadge } from '../components/CategoryBadge'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { useTranslation } from 'react-i18next'
import { getCountryCode, formatToHumanMonetary, labelForCategory } from '../utils/utils'
import i18n from 'i18next'

countries.registerLocale(enLocale)

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
	const { t } = useTranslation()
	const profile = company.deepReport?.companyProfile || company.shallowReport?.companyProfile
	if (!profile) return null

	const countryCode = getCountryCode(company.country)
	const FlagComponent = countryCode ? Flags[countryCode as keyof typeof Flags] : null

	const incorporationCountryCode = company.incorporationCountry && getCountryCode(company.incorporationCountry)
	const IncorporationFlagComponent = incorporationCountryCode
		? Flags[incorporationCountryCode as keyof typeof Flags]
		: null

	return (
		<Section title={t('company.company_profile')} className="md:col-span-2">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
				<DataPoint
					label={t('company.country')}
					value={
						<span className="flex items-center">
							{FlagComponent && <FlagComponent className="h-4 w-4 mr-2" />}
							{company.country}
						</span>
					}
				/>
				<DataPoint
					label={t('company.incorporation_country')}
					value={
						<span className="flex items-center">
							{IncorporationFlagComponent && <IncorporationFlagComponent className="h-4 w-4 mr-2" />}
							{company.incorporationCountry}
						</span>
					}
				/>
				<DataPoint label={t('company.sector')} value={company.sector} />
				<DataPoint label={t('company.founded')} value={profile.founded} />
			</div>
			<div className="mt-4 space-y-4">
				<div>
					<h4 className="font-medium text-gray-900 dark:text-gray-100">{t('company.business_description')}</h4>
					<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{profile.businessDescription}</p>
				</div>
				{isDeepReportProfile(profile) && (
					<>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100">{t('company.business_model')}</h4>
							<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
								{profile.businessModelAndMarketPosition}
							</p>
						</div>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100">
								{t('company.global_footprint')}
							</h4>
							<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
								{profile.globalFootprintAndStrategicAlliances}
							</p>
						</div>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-gray-100">{t('company.product_portfolio')}</h4>
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
		<Section title={t('company.risk_assessment')} className="md:col-span-2">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<DataPoint
					label={t('company.category')}
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
				<DataPoint label={t('company.guidelines')} value={risk.guidelines?.join(', ') || 'N/A'} />
			</div>

			<div className="space-y-4">
				<div>
					<h4 className="font-medium text-gray-900 dark:text-gray-100">{t('company.concerns')}</h4>
					<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{risk.concerns}</p>
				</div>
				<div>
					<h4 className="font-medium text-gray-900 dark:text-gray-100">{t('company.rationale')}</h4>
					<p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{risk.rationale}</p>
				</div>

				{'executiveSummary' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">{t('company.executive_summary')}</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>{t('company.purpose_scope')}:</strong> {risk.executiveSummary.purposeAndScope}
							</p>
							<p>
								<strong>{t('company.key_findings')}:</strong> {risk.executiveSummary.keyFindings}
							</p>
							<p>
								<strong>{t('company.recommendation')}:</strong> {risk.executiveSummary.recommendation}
							</p>
						</div>
					</>
				)}

				{'productBasedAssessment' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">{t('company.product_assessment')}</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>{t('company.product_summary')}:</strong> {risk.productBasedAssessment.summary}
							</p>
							<p>
								<strong>{t('company.weapons_violation')}:</strong> {risk.productBasedAssessment.weaponsViolationRisk}
							</p>
							<p>
								<strong>{t('company.cannabis_risk')}:</strong> {risk.productBasedAssessment.cannabisRisk}
							</p>
							<p>
								<strong>{t('company.thermal_coal_risk')}:</strong> {risk.productBasedAssessment.thermalCoalRisk}
							</p>
							<p>
								<strong>{t('company.tobacco_risk')}:</strong> {risk.productBasedAssessment.tobaccoProductionRisk}
							</p>
						</div>
					</>
				)}

				{'conductBasedAssessment' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">{t('company.conduct_assessment')}</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>{t('company.human_rights')}:</strong> {risk.conductBasedAssessment.humanRightsViolations}
							</p>
							<p>
								<strong>{t('company.rights_in_war')}:</strong> {risk.conductBasedAssessment.rightsInWarOrConflict}
							</p>
							<p>
								<strong>{t('company.env_damage')}:</strong> {risk.conductBasedAssessment.environmentalDamage}
							</p>
							<p>
								<strong>{t('company.weapons_sales')}:</strong> {risk.conductBasedAssessment.weaponsSales}
							</p>
							<p>
								<strong>{t('company.corruption')}:</strong> {risk.conductBasedAssessment.corruptionAndEthicalNorms}
							</p>
						</div>
					</>
				)}

				{'geopoliticalRiskExposure' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">{t('company.geopolitical_risk')}</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>{t('company.russia_ukraine')}:</strong> {risk.geopoliticalRiskExposure.russiaUkraineConflict}
							</p>
							<p>
								<strong>{t('company.israel_palestine')}:</strong> {risk.geopoliticalRiskExposure.israeliPalestinianConflict}
							</p>
							<p>
								<strong>{t('company.supply_chain_china')}:</strong> {risk.geopoliticalRiskExposure.supplyChainChinaExposure}
							</p>
							<p>
								<strong>{t('company.inconsistent_ethics')}:</strong> {risk.geopoliticalRiskExposure.inconsistentEthicalPostures}
							</p>
						</div>
					</>
				)}

				{'finalRiskSynthesis' in risk && (
					<>
						<h4 className="text-md font-medium mt-4 mb-1">{t('company.final_risk')}</h4>
						<div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
							<p>
								<strong>{t('company.synthesis')}:</strong> {risk.finalRiskSynthesis.synthesisOfFindings}
							</p>
							<p>
								<strong>{t('company.weighing_factors')}:</strong> {risk.finalRiskSynthesis.weighingOfFactors}
							</p>
							<p>
								<strong>{t('company.final_justification')}:</strong>{' '}
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
	if (!company) return <p className="text-red-600">{t('company.not_found')}</p>

	const report = company.deepReport || company.shallowReport
	const profile = company.deepReport?.companyProfile || company.shallowReport?.companyProfile

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<Link className="text-blue-700 hover:underline dark:text-blue-400" to="/companies">
					{t('company.back_to_companies')}
				</Link>
			</div>

			<h2 className="text-3xl font-bold tracking-tight">{company.name}</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2 space-y-8">
					<CompanyProfile company={company} />
					{report && <RiskAssessment report={report} />}
				</div>

				<div className="space-y-4">
					<Section title={t('company.investment_snapshot')}>
						<div className="space-y-4">
							<DataPoint
								label={t('company.market_value')}
								value={`${new Intl.NumberFormat('nb-NO').format(company.marketValueNok)} (${formatToHumanMonetary(
									company.marketValueNok,
									i18n.language,
								)})`}
							/>
							<div className="grid grid-cols-2 gap-4">
								<DataPoint label={t('company.ownership')} value={`${company.ownership}%`} />
								{company.voting && <DataPoint label={t('company.voting')} value={`${company.voting}%`} />}
							</div>
							{profile && (
								<div className="grid grid-cols-2 gap-4">
									<DataPoint label={t('company.ticker')} value={profile.ticker} />
									<DataPoint label={t('company.exchange')} value={profile.exchange} />
								</div>
							)}
						</div>
					</Section>

					{company.deepReport ? (
						<Section title={t('company.deep_research')}>
							<p className="mb-4">{t('company.deep_research_text')}</p>
							<div className="flex justify-end">
								<a
									href={`https://storage.googleapis.com/oljevakt-investments/${company.id}.pdf`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/80"
								>
									{t('company.view_report')}
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
										{t('company.deep_analysis_pending')}
									</h3>
									<div className="mt-2 text-sm text-yellow-700 dark:text-yellow-100">
										<p>{t('company.deep_analysis_pending_text')}</p>
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


