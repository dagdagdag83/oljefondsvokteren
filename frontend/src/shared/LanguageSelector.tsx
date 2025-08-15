import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Flags from 'country-flag-icons/react/3x2'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const languages = [
	{ code: 'en', name: 'English', flag: <Flags.GB className="h-5 w-5" /> },
	{ code: 'no', name: 'Norsk', flag: <Flags.NO className="h-5 w-5" /> },
]

export function LanguageSelector() {
	const { i18n } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang)
		localStorage.setItem('lang', lang)
		setIsOpen(false)
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const currentLanguage = languages.find((lang) => i18n.language.startsWith(lang.code)) || languages[0]

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
			>
				{currentLanguage.flag}
				<span>{currentLanguage.name}</span>
				<ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
					<div className="py-1">
						{languages.map((lang) => (
							<button
								key={lang.code}
								onClick={() => changeLanguage(lang.code)}
								className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								{lang.flag}
								<span>{lang.name}</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
