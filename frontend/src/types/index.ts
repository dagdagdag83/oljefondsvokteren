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
