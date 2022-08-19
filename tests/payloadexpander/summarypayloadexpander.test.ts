import ReaderPayload from "../../src/readerpayload";
import {ObsidianToReaderSettings} from "../../src/settings";
import SummaryPayloadExpander from "../../src/payloadexpander/summarypayloadexpander";

const expander = new SummaryPayloadExpander();
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

test('If no frontmatter tag is present, no summary gets written into the payload', () => {
	const markdown = `---
no-summary: at all
---
A Test
`;
	payload = expander.expandPayload(settings, payload, markdown);
	expect(payload.summary).toBeUndefined();
});

test('If a summary frontmatter tags is present, it gets written into the payload.', () => {
	const markdown = `---
summary: This is a short summary for my jest test.
---
A test`;

	payload = expander.expandPayload(settings, payload, markdown);
	expect(payload.summary).toEqual('This is a short summary for my jest test.');
});
