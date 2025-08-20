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

export const formatToHumanMonetary = (value: number) => {
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
