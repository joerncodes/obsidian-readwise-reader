import FrontmatterParser from "../../src/frontmatter/frontmatterparser";

test('Front matter parses front matter keys correctly', () => {
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

test('URLs can be set as front matter values', () => {
	const markdown = `---
url: https://obsidiantoreader.com
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	expect(parser.getFrontmatter('url')?.getValue()).toEqual('https://obsidiantoreader.com');
});

test('Parser can strip front matter from markdown content', () => {
	const markdown = `---
title: A Title
summary: A short text
---

# More Markdown

`;
	const parser = new FrontmatterParser(markdown);
	expect(parser.stripFrontmatter()).toEqual('# More Markdown');
});

test('Parser can set front matter keys', () => {
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

test('Parser reads arrays correctly', () => {
	const markdown = `---
tags: [one, two]
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	const actual = parser.getFrontmatter('tags')?.getValue();

	expect(Array.isArray(actual)).toBe(true);
	expect(actual.length).toEqual(2);
	expect(actual[1]).toEqual('two');
});

test('Parser reads empty arrays correctly', () => {
	const markdown = `---
tags: [ ]
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	const actual = parser.getFrontmatter('tags')?.getValue();

	expect(Array.isArray(actual)).toBe(true);
	expect(actual.length).toEqual(0);
});

test('Parser sets front matter arrays', () => {
	const markdown = `---
title: A Title
---
# More Markdown
`;
	const parser = new FrontmatterParser(markdown);
	parser.setFrontmatter('tags', ['one', 'two']);
	expect(parser.saveFrontmatter()).toEqual(`---
title: A Title
tags: [one, two]
---
# More Markdown
`);
});
