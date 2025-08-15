import React from 'react'
import { Link } from 'react-router-dom'

export function MelexisFullReport() {
	return (
		<div className="grid lg:grid-cols-4 gap-8">
			<aside className="lg:col-span-1">
				<div className="sticky top-24">
					<nav>
						<h3 className="font-semibold text-lg mb-4">Contents</h3>
						<ul className="space-y-2">
							<li>
								<a href="#summary" className="text-blue-600 hover:underline dark:text-blue-400">
									Executive Summary
								</a>
							</li>
							<li>
								<a href="#profile" className="text-blue-600 hover:underline dark:text-blue-400">
									Corporate Profile
								</a>
							</li>
							<li>
								<a href="#product-criteria" className="text-blue-600 hover:underline dark:text-blue-400">
									Product-Based Criteria (§ 3)
								</a>
							</li>
							<li>
								<a href="#conduct-criteria" className="text-blue-600 hover:underline dark:text-blue-400">
									Conduct-Based Criteria (§ 4)
								</a>
							</li>
							<li>
								<a href="#geopolitical" className="text-blue-600 hover:underline dark:text-blue-400">
									Geopolitical Risk
								</a>
							</li>
							<li>
								<a href="#synthesis" className="text-blue-600 hover:underline dark:text-blue-400">
									Final Synthesis
								</a>
							</li>
						</ul>
					</nav>
					<Link to="/companies/melexis-nv" className="inline-block mt-6 text-sm text-blue-700 hover:underline dark:text-blue-400">
						← Back to Company Summary
					</Link>
				</div>
			</aside>
			<main className="lg:col-span-3 prose max-w-none dark:prose-invert">
				<section id="summary">
					<h2>I. Executive Summary</h2>
					<h3>Purpose and Scope</h3>
					<p>
						This report presents a comprehensive risk assessment of the Belgian semiconductor company Melexis NV (Euronext
						Brussels: MELE). The analysis is conducted for the Council on Ethics of the Norwegian Government Pension
						Fund Global (GPFG) and Norges Bank Investment Management (NBIM). The primary objective is to evaluate the
						company's operations, products, and corporate conduct against the criteria established in the GPFG's
						"Guidelines for Observation and Exclusion of companies from the Government Pension Fund Global."
					</p>

					<h3>Key Findings</h3>
					<p>
						The assessment reveals a complex and bifurcated risk profile for Melexis NV. The company demonstrates
						robust corporate governance, strong environmental policies, and a clear, commendable ethical stance in
						relation to Russia's unjust war against Ukraine, where it maintains a significant and supportive
						presence. However, a significant and unmitigated risk exists concerning the company's indirect
						contribution to serious violations of individuals' rights in situations of war and conflict, specifically
						the Israeli-Palestinian conflict.
					</p>

					<h3>Final Recommendation</h3>
					<p>
						This assessment concludes that Melexis NV's operations and business model present an unacceptable risk of
						contributing to serious violations of fundamental ethical norms, as defined by the GPFG guidelines.
					</p>
					<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
						<p className="font-bold">Final Risk Category: 2 - High Risk</p>
					</div>
				</section>

				<section id="profile">
					<h2>II. Corporate Profile and Global Operations</h2>
					<h3>Business Model and Market Position</h3>
					<p>
						Melexis NV is a global micro-electronic semiconductor company headquartered in Ieper, Belgium. A defining
						characteristic of Melexis's business model is its "fabless" nature, focusing on R&D while outsourcing
						wafer fabrication. The automotive sector is the cornerstone of Melexis's business, accounting for
						approximately 90% of its total revenue.
					</p>
				</section>

				<section id="product-criteria">
					<h2>III. Assessment Against GPFG Product-Based Exclusion Criteria (§ 3)</h2>
					<p>
						An analysis of Melexis NV against these criteria shows no grounds for observation or exclusion. The company
						is not involved in the production of prohibited weapons, tobacco, cannabis, or thermal coal.
					</p>
				</section>

				<section id="conduct-criteria">
					<h2>IV. Assessment Against GPFG Conduct-Based Exclusion Criteria (§ 4)</h2>
					<h3>§ 4a - Serious or Systematic Human Rights Violations</h3>
					<p>
						Melexis has established a comprehensive framework of public policies regarding human rights. Despite these
						robust policies, a moderate level of risk remains due to the complexity of the global semiconductor
						supply chain, with dependencies in regions like China and Malaysia.
					</p>
					<h3>§ 4b - Serious Violations of Individuals' Rights in Situations of War or Conflict</h3>
					<p>
						Semiconductors are a quintessential dual-use technology. The analysis reveals a high risk of Melexis's
						products contributing to the Israeli-Palestinian conflict. Its products are readily available in Israel
						through major global distributors, making it highly probable they are incorporated into defense systems.
					</p>
				</section>

				<section id="geopolitical">
					<h2>V. Geopolitical Risk Exposure and Mitigating Factors</h2>
					<h3>Position on the Russia-Ukraine Conflict</h3>
					<p>
						Melexis has taken a clear, tangible, and positive stance. The company has maintained its R&D center in
						Kyiv, Ukraine, throughout the conflict, demonstrating a willingness to align its business practices with
						fundamental ethical principles.
					</p>
					<h3>Analysis of Inconsistent Ethical Postures</h3>
					<p>
						The company's proactive, values-aligned stance on Ukraine contrasts sharply with its passive, legally
						defensive posture regarding the Israeli-Palestinian conflict. This suggests that ethical decision-making
						may be driven more by compliance and legal liability minimization.
					</p>
				</section>

				<section id="synthesis">
					<h2>VI. Final Risk Synthesis and Categorization</h2>
					<p>
						The company exhibits many characteristics of a responsible corporate actor but is overshadowed by the
						critical, unmitigated risk of its products contributing to serious violations of rights in the
						Israeli-Palestinian conflict. The final determination is that the risk is substantial, active, and not
						adequately managed.
					</p>
					<p className="font-bold text-xl mt-4">Final Risk Category: 2 - High Risk</p>
				</section>
			</main>
		</div>
	)
}
