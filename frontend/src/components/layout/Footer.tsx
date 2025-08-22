import React from 'react'

export function Footer() {
	return (
		<footer className="border-t border-primary/20 mt-8 py-6 text-sm text-gray-600 dark:text-gray-400">
			<div className="container text-center">
				<p className="font-semibold">Oljefondsvokteren created by Dag Sneeggen</p>
				<div className="flex justify-center gap-4 my-2">
					<a href="https://dag.quest" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
						dag@quest
					</a>
					<a href="https://linkedin.com/in/dags83" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
						dag@linkedin
					</a>
				</div>
				<p className="text-xs text-gray-500">
					Vibe-coded with my BFFs Cursor & Google Gemini{' '}
					<span role="img" aria-label="diamond">
						🔷
					</span>
				</p>
				<a
					href="https://github.com/dagdagdag83/oljefondsvokteren"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-primary text-xs"
				>
					oljefondsvokteren@github
				</a>
			</div>
		</footer>
	)
}
