import AuthorPayloadExpander from "../../src/payloadexpander/authorpayloadexpander";
import ReaderPayload from "../../src/readerpayload";
import {ObsidianToReaderSettings} from "../../src/settings";

const expander = new AuthorPayloadExpander();
let payload:ReaderPayload = {
	title: 'A test',
	html: '<h1>A test</h1>',
	url: 'https://obsidiantoreader.com'
};
let settings:ObsidianToReaderSettings = {
	accessToken: '',
	generalTags: [],
	frontmatter: true,
};

test('If no author is present in either frontmatter or settings, no author gets set.', () => {
	const markdown = `---
no-author: at all
---
# A Test
`;
	payload = expander.expandPayload(settings, payload, markdown);

	expect(payload.author).toBeUndefined();
});

test('Fallback author gets written into payload.', () => {
	const markdown = `---
no-author: at all
---
# A Test
`;
	settings.fallbackAuthor = 'Terry Pratchett';
	payload = expander.expandPayload(settings, payload, markdown);

	expect(payload.author).toBe('Terry Pratchett');
});

test('Frontmatter author overwrites settings author.', () => {
	const markdown = `---
author: Douglas Adams
---
# A Test
`;
	settings.fallbackAuthor = 'Terry Pratchett';
	payload = expander.expandPayload(settings, payload, markdown);

	expect(payload.author).toBe('Douglas Adams');
});