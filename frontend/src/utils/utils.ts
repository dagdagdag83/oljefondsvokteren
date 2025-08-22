import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale)

export const getCountryCode = (countryName: string): string | undefined => {
	if (countryName === 'United States') return 'US'
	if (countryName === 'United Kingdom') return 'GB'
	if (countryName.toLowerCase().includes('hong kong')) return 'HK'
	return countries.getAlpha2Code(countryName, 'en')
}

export const shortenSector = (sector: string) => {
	return sector === 'Consumer Discretionary' ? 'Consumer Disc.' : sector
}

export const formatToHumanMonetary = (value: number, lang: string) => {
	const abbreviations =
		lang === 'no'
			? {
					t: 'bill.', // Trillion -> Billion
					b: 'mrd.', // Billion -> Milliard
					m: 'mill.', // Million
					k: 'K', // Thousand
			  }
			: {
					t: 'Tn',
					b: 'Bn',
					m: 'M',
					k: 'K',
			  }

	if (Math.abs(value) >= 1e12) {
		const num = (value / 1e12).toFixed(1).replace(/\.0$/, '')
		return lang === 'no' ? `${num} ${abbreviations.t}` : `${num}${abbreviations.t}`
	}
	if (Math.abs(value) >= 1e9) {
		const num = (value / 1e9).toFixed(1).replace(/\.0$/, '')
		return lang === 'no' ? `${num} ${abbreviations.b}` : `${num}${abbreviations.b}`
	}
	if (Math.abs(value) >= 1e6) {
		const num = (value / 1e6).toFixed(1).replace(/\.0$/, '')
		return lang === 'no' ? `${num} ${abbreviations.m}` : `${num}${abbreviations.m}`
	}
	if (Math.abs(value) >= 1e3) {
		return `${(value / 1e3).toFixed(1).replace(/\.0$/, '')}${abbreviations.k}`
	}
	return value.toString()
}

export function labelForCategory(val: string, t: (k: string) => string) {
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

export function truncate(str: string, length: number): string {
	if (str.length <= length) {
		return str
	}
	return str.slice(0, length) + '…'
}
