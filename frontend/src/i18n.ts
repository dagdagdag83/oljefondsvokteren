import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
	en: {
		translation: {
			app: {
				title: 'Oljefondsvokteren',
				health: 'Health',
				overview: 'Overview',
				companies: 'Companies',
				browseCompanies: 'Browse Companies',
				exploreCompanies: 'Explore Companies',
				aboutNbim: 'About NBIM',
				insights: 'Insights',
				search: 'Search for a company',
			},
			landing: {
				lead: "A platform for AI-driven analyses of the Norwegian Government Pension Fund Global (Oljefondet) investments. Each portfolio company is assessed through a Gemini Deep Research analysis in accordance with the fund's ethical guidelines. The service identifies potential risks related to environmental, social, and corporate governance (ESG).",
				snapshot: 'Portfolio at a glance',
				totalValue: 'Total Value',
				companies: 'Companies',
				sectors: 'Sectors',
				countries: 'Countries',
				banner: {
					title: 'This is a proof-of-concept',
					text: 'This site is a proof-of-concept and has not analyzed all 8,000+ holdings of the Norwegian Oljefondet. Only a selection has been analyzed with Google Gemini.',
				},
			},
			companies: {
				filters: { search: 'Search…', country: 'Country', sector: 'Sector', category: 'All categories', report_type: 'Report Type' },
				columns: { name: 'Name', country: 'Country', sector: 'Sector', category: 'Category', guideline: 'Guideline', concerns: 'Concerns', ai_report: 'AI Report' },
				category: { all: 'All categories', c1: 'Exclusion Candidate', c2: 'High Risk', c3: 'Moderate Risk', c4: 'Acceptable Risk' },
				report_type: { all: 'All Reports', none: 'None', basic: 'Basic', deep: 'Deep' },
				paging: { prev: 'Prev', next: 'Next' },
			},
			charts: {
				byCategory: 'Companies by Category',
				byCategoryRisk: 'Companies by Risk Category',
				bySector: 'Companies by Sector',
				topCountries: 'Top 10 Countries by Company Count',
				topInvestments: 'Top 10 Investments by Market Value (NOK)',
				valueBySector: 'Total Investment Value by Sector',
				valueByCountry: 'Total Investment Value by Country',
				ok: 'OK',
				monitor: 'Monitor',
				observe: 'Observe',
				exclude: 'Exclusion Candidate',
			},
			company: {
				guideline: 'Ethic Council Guidelines',
			},
			overview: {
				title: 'Norwegian Government Pension Fund Global (Oljefondet)',
				description: 'This is an unofficial dashboard for monitoring the ethical status of the investments.',
				assets_total: 'Total Assets',
				assets_equity: 'Equity',
				assets_fixed_income: 'Fixed Income',
				assets_real_estate: 'Real Estate',
				warning: {
					title: 'This is a proof-of-concept',
					text: 'This site is a proof-of-concept and has not analyzed all 8,000+ holdings of the Norwegian Oljefondet. Only a selection has been analyzed with Google Gemini.',
				},
				'by-category': 'By Category',
				'by-country': 'By Country',
			},
		}
	},
	no: {
		translation: {
			app: {
				title: 'Oljefondsvokteren',
				health: 'Helse',
				overview: 'Oversikt',
				companies: 'Selskaper',
				browseCompanies: 'Utforsk selskaper',
				exploreCompanies: 'Utforsk Selskaper',
				aboutNbim: 'Om NBIM',
				insights: 'Innsikt',
				search: 'Søk etter selskap',
			},
			landing: {
				lead: "En plattform for AI-drevne analyser av Oljefondets investeringer. Hvert porteføljeselskap blir vurdert gjennom en Gemini Deep Research-analyse i henhold til fondets etiske retningslinjer. Tjenesten identifiserer potensielle risikoer knyttet til miljø, sosiale forhold og selskapsstyring (ESG).",
				snapshot: 'Øyeblikksbilde',
				totalValue: 'Total Verdi',
				companies: 'Selskaper',
				sectors: 'Sektorer',
				countries: 'Land',
				banner: {
					text: 'Denne siden er en konsepttest og har ikke analysert alle fondets over 7000 beholdninger.',
					dismiss: 'Lukk',
				},
			},
			companies: {
				filters: { search: 'Søk…', country: 'Land', sector: 'Sektor', category: 'Alle kategorier', report_type: 'Rapporttype' },
				columns: { name: 'Navn', country: 'Land', sector: 'Sektor', category: 'Kategori', guideline: 'Retningslinje', concerns: 'Bekymringer', ai_report: 'AI-rapport' },
				category: { all: 'Alle kategorier', c1: 'Kandidat for utelukkelse', c2: 'Høy Risiko', c3: 'Moderat Risiko', c4: 'Akseptabel Risiko' },
				report_type: { all: 'Alle Rapporter', none: 'Ingen', basic: 'Grunnleggende', deep: 'Dybde' },
				paging: { prev: 'Forrige', next: 'Neste' },
			},
			charts: {
				byCategory: 'Selskaper etter kategori',
				bySector: 'Selskaper etter sektor',
				topCountries: 'Topp 10 land etter antall selskaper',
				topInvestments: 'Topp 10 investeringer (markedsverdi)',
				valueBySector: 'Total investeringsverdi etter sektor',
				valueByCountry: 'Total investeringsverdi etter land',
				ok: 'OK',
				monitor: 'Overvåk',
				observe: 'Observer',
				exclude: 'Kandidat for utelukkelse',
			},
			company: {
				guideline: 'Etikkrådet retningslinjer',
			},
		}
	},
}

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		supportedLngs: ['en', 'no'],
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			lookupLocalStorage: 'lang',
		},
		interpolation: { escapeValue: false },
	})

export default i18n


