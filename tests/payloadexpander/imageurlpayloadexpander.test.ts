import ReaderPayload from "../../src/readerpayload";
import ImageUrlPayloadExpander from "../../src/payloadexpander/imageurlpayloadexpander";
import ObsidianToReaderSettingsInterface from "../../src/settings/obsidiantoreadersettingsinterface";
import {DEFAULT_SETTINGS} from "../../src/constants";

const expander = new ImageUrlPayloadExpander();
let payload:ReaderPayload = {
	title: 'A test',
	html: '<h1>A test</h1>',
	url: 'https://obsidiantoreader.com'
};
const settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS};

test('If no front matter tag is present, no image_url gets written into the payload', () => {
	const markdown = `---
no-image: at all
---
A Test
`;
	payload = expander.expandPayload(settings, payload, markdown);
	expect(payload.image_url).toBeUndefined();
});

test('The front matter tag banner will get written into the payload as image_url.', () => {
	const markdown = `---
banner: https://images.unsplash.com/photo-1660314176057-d01f4ec7d4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2912&q=80
---
A Test
`;
	payload = expander.expandPayload(settings, payload, markdown);
	expect(payload.image_url).toBe('https://images.unsplash.com/photo-1660314176057-d01f4ec7d4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2912&q=80');
});

test('If the front matter tag image-url is present, it supercedes banner.', () => {
	const markdown = `---
banner: https://images.unsplash.com/photo-1660314176057-d01f4ec7d4ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2912&q=80
image-url: https://images.unsplash.com/photo-1660849960806-d558c49d0f33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80
---
A Test
`;
	payload = expander.expandPayload(settings, payload, markdown);
	expect(payload.image_url).toBe('https://images.unsplash.com/photo-1660849960806-d558c49d0f33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80');
});
