import {CachedMetadata} from "obsidian";
import TagCollector from "../src/tagcollector";
import ObsidianToReaderSettingsInterface from "../src/settings/obsidiantoreadersettingsinterface";
import {DEFAULT_SETTINGS} from "../src/constants";

let settings:ObsidianToReaderSettingsInterface= {...DEFAULT_SETTINGS};
let cachedMetadata:CachedMetadata = {

}

test('No tags at all', () => {
	const markdown = '# A Test';
	const collector = new TagCollector(markdown, cachedMetadata, settings);
	const tags = collector.gatherTags();
	expect(tags.length).toEqual(0);
});

test('General tags get parsed', () => {
	let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS, 'generalTags' : ['obsidian']};
	console.log(settings);
	const markdown = '# A Test';
	const collector = new TagCollector(markdown, cachedMetadata, settings);
	const tags = collector.gatherTags();
	expect(tags.length).toEqual(1);
	expect(tags[0]).toEqual('obsidian');
});

// @todo test frontmatter tags
// @todo test note tags
// @todo test all together
