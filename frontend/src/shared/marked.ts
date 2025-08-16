import { marked } from 'marked'

const stripMarkdownFormatting = (text: string) => {
	return text.replace(/\*\*|__|[\\*_]/g, '').trim()
}

const slugify = (text: string) =>
	stripMarkdownFormatting(text)
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')

// Configure marked to add IDs to headings. This now runs only once.
marked.use({
	hooks: {
		preprocess: (markdown) => {
			return markdown.replace(/^## (.*$)/gim, (match, content) => {
				if (/{#.*}$/.test(content.trim())) {
					return match
				}
				return `## ${content} {#${slugify(content)}}`
			})
		},
	},
})

export { marked, slugify, stripMarkdownFormatting }
