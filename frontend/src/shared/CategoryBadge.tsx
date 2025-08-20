import {
	XCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/solid'

export function CategoryBadge({ n, className }: { n: number; className?: string }) {
	const base = `h-6 w-6 ${className}`

	switch (n) {
		case 1:
			return <XCircleIcon className={`${base} text-red-500`} title="Exclusion Candidate" />
		case 2:
			return <ExclamationTriangleIcon className={`${base} text-orange-500`} title="High Risk" />
		case 3:
			return <InformationCircleIcon className={`${base} text-yellow-500`} title="Moderate Risk" />
		case 4:
			return <CheckCircleIcon className={`${base} text-green-500`} title="Acceptable Risk" />
		default:
			return null
	}
}
