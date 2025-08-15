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
				lead: "An AI-powered platform for analyzing the investments of the Norwegian Government Pension Fund. Each portfolio company undergoes an assessment by Gemini Deep Research based on the Fund's ethical guidelines, identifying potential environmental, social, and governance (ESG) risk factors.",
				snapshot: 'Snapshot',
				companies: 'Companies',
				sectors: 'Sectors',
				countries: 'Countries',
				banner: {
					text: 'This site is a proof-of-concept and has not analyzed all 7,000+ holdings of the fund.',
					dismiss: 'Dismiss',
				},
			},
			companies: {
				filters: { search: 'Search…', country: 'Country', sector: 'Sector', category: 'All categories' },
				columns: { name: 'Name', country: 'Country', sector: 'Sector', category: 'Category', guideline: 'Guideline', concerns: 'Concerns', ai_report: 'AI Report' },
				category: { all: 'All categories', c4: 'Exclusion Candidate', c3: 'High Risk', c2: 'Moderate Risk', c1: 'Clear' },
				paging: { prev: 'Prev', next: 'Next' },
			},
			charts: {
				byCategory: 'Companies by Category',
				bySector: 'Companies by Sector',
				topCountries: 'Top 10 Countries by Company Count',
				topInvestments: 'Top 10 Investments by Market Value',
				valueBySector: 'Total Investment Value by Sector',
				valueByCountry: 'Total Investment Value by Country',
				ok: 'OK',
				monitor: 'Monitor',
				observe: 'Observe',
				exclude: 'Exclusion Candidate'
			}
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
				companies: 'Selskaper',
				sectors: 'Sektorer',
				countries: 'Land',
				banner: {
					text: 'Denne siden er en konsepttest og har ikke analysert alle fondets over 7000 beholdninger.',
					dismiss: 'Lukk',
				},
			},
			companies: {
				filters: { search: 'Søk…', country: 'Land', sector: 'Sektor', category: 'Alle kategorier' },
				columns: { name: 'Navn', country: 'Land', sector: 'Sektor', category: 'Kategori', guideline: 'Retningslinje', concerns: 'Bekymringer', ai_report: 'AI-rapport' },
				category: { all: 'Alle kategorier', c4: 'Kandidat for utelukkelse', c3: 'Høy Risiko', c2: 'Moderat Risiko', c1: 'Akseptabel' },
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
				exclude: 'Kandidat for utelukkelse'
			}
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


