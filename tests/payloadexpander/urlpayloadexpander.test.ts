import URLPayloadExpander from "../../src/payloadexpander/urlpayloadexpander";
import ReaderPayload from "../../src/readerpayload";
import ObsidianToReaderSettingsInterface from "../../src/settings/obsidiantoreadersettingsinterface";
import {DEFAULT_SETTINGS, OBSIDIAN_TO_READER_URL} from "../../src/constants";
import {FileStats, TFile, TFolder, Vault} from "obsidian";
import ObsidianURLStrategy from "../../src/urlstrategy/obsidianurlstrategy";
import ObsidianURLPartsInterface from "../../src/urlstrategy/obsidianurlpartsinterface";

const expander = new URLPayloadExpander();

let payload:ReaderPayload = {
	title: 'A test',
	html: '<h1>A test</h1>',
	url: 'https://obsidiantoreader.com'
};

let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS};

test('Without frontmatter, the Obsidian to Reader url gets submitted.', () => {
	payload = expander.expandPayload(settings, payload, '# A Test');
	expect(payload.url).toEqual(OBSIDIAN_TO_READER_URL);
});

test('The source frontmatter overwrites the url.', () => {
	const markdown = `---
source: https://read.readwise.io
---

# Markdown`;

	payload = expander.expandPayload(settings, payload, markdown);
	expect(payload.url).toEqual('https://read.readwise.io');
});

test('Test obsidian backlink url', () => {
	const vault:Vault = {
		getName() { return 'Test vault'; }
	} as Vault;

	expander.setUrlStrategy(new ObsidianURLStrategy({
		basename: 'A Test file',
		vault: vault
	} as ObsidianURLPartsInterface));
	payload = expander.expandPayload(settings, payload, '# A Test');

	expect(payload.url).toBe('https://obsidiantoreader.com/to?url=obsidian%3A%2F%2Fopen%3Fvault%3DTest%2520vault%26file%3DA%2520Test%2520file');
});
