import FrontmatterParser from "../../src/frontmatter/frontmatterparser";

test('Frontmatter parses frontmatter keys correctly', () => {
	const markdown = `---
title: A Title
summary: A short text
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	expect(parser.getFrontmatter('title')?.getValue()).toEqual('A Title');
	expect(parser.getFrontmatter('summary')?.getValue()).toEqual('A short text');
});

test('URLs can be set as frontmatter values', () => {
	const markdown = `---
url: https://obsidiantoreader.com
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	expect(parser.getFrontmatter('url')?.getValue()).toEqual('https://obsidiantoreader.com');
});

test('Parser can strip frontmatter from markdown content', () => {
	const markdown = `---
title: A Title
summary: A short text
---

# More Markdown

`;
	const parser = new FrontmatterParser(markdown);
	expect(parser.stripFrontmatter()).toEqual('# More Markdown');
});

test('Parser can set frontmatter keys', () => {
	const markdown = `---
title: A Title
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	parser.setFrontmatter('summary', 'A short text');
	expect(parser.saveFrontmatter()).toEqual(`---
title: A Title
summary: A short text
---
# More Markdown
`);
});
