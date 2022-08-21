import {CachedMetadata, TagCache} from "obsidian";
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
	let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS, generalTags : ['obsidian']};
	const markdown = '# A Test';
	const collector = new TagCollector(markdown, cachedMetadata, settings);
	const tags = collector.gatherTags();
	expect(tags.length).toEqual(1);
	expect(tags[0]).toEqual('obsidian');
});

test('Frontmatter tags get parsed', () => {
	let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS, noteTags : true};
	const markdown = `---
title: A Title
tags: [one, two, three]
---

# Markdown title
`;
	const collector = new TagCollector(markdown, cachedMetadata, settings);
	const tags = collector.gatherTags();
	expect(tags.length).toEqual(3);
	expect(tags[1]).toEqual('two');
});

test('Inline note tags get parsed', () => {
	let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS, noteTags : true};
	const markdown = '# Markdown title';

	const tagCaches:TagCache[] = [
		{tag:'one' } as TagCache,
		{tag:'two' } as TagCache,
		{tag:'three/four' } as TagCache,
	];

	let cachedMetadata:CachedMetadata = {
		tags: tagCaches
	};

	const collector = new TagCollector(markdown, cachedMetadata, settings);
	const tags = collector.gatherTags();

	expect(tags.length).toEqual(3);
	expect(tags[2]).toEqual('three/four');
});

test('Test all tag collection together', () => {
	let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS, noteTags : true, generalTags: ['one', 'two']};
	const markdown = `---
title: A Title
tags: [three]
---`;

	const tagCaches:TagCache[] = [
		{tag:'four' } as TagCache,
		{tag:'five/six' } as TagCache,
	];

	let cachedMetadata:CachedMetadata = {
		tags: tagCaches
	};

	const collector = new TagCollector(markdown, cachedMetadata, settings);
	const tags = collector.gatherTags();

	expect(tags.length).toEqual(5);
	expect(tags[1]).toEqual('two');
	expect(tags[4]).toEqual('five/six');

});

