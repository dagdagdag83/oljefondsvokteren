import React from 'react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
	page: number
	pageCount: number
	setPage: (page: number) => void
}

export function Pagination({ page, pageCount, setPage }: PaginationProps) {
	const { t } = useTranslation()
	return (
		<div className="flex items-center justify-between p-3 mt-4">
			<button
				className="px-3 py-1.5 rounded bg-primary text-white disabled:opacity-40"
				disabled={page <= 1}
				onClick={() => setPage(page - 1)}
			>
				{t('companies.paging.prev')}
			</button>
			<div>
				Page {page} / {pageCount}
			</div>
			<button
				className="px-3 py-1.5 rounded bg-primary text-white disabled:opacity-40"
				disabled={page >= pageCount}
				onClick={() => setPage(page + 1)}
			>
				{t('companies.paging.next')}
			</button>
		</div>
	)
}
