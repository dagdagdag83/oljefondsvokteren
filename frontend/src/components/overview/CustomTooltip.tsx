import React from 'react'

// Custom Tooltip Content Component
export const CustomTooltip = ({ active, payload, formatter }: any) => {
	if (active && payload && payload.length) {
		const data = payload[0]
		const formattedText = formatter(data.value, data.name, data.payload)

		return (
			<div className="rounded-md border bg-background px-2 py-1 text-sm shadow-lg">
				<p>{formattedText}</p>
			</div>
		)
	}
	return null
}
