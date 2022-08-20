import {CachedMetadata} from "obsidian";
import FrontmatterParser from "./frontmatter/frontmatterparser";
import {FRONTMATTER_KEYS} from "./constants";
import ObsidianToReaderSettingsInterface from "./settings/obsidiantoreadersettingsinterface";

export default class TagCollector
{
	private markdown:string;
	private metadata:CachedMetadata;
	private settings:ObsidianToReaderSettingsInterface;

	constructor(markdown:string, metadata:CachedMetadata, settings:ObsidianToReaderSettingsInterface) {
		this.markdown = markdown;
		this.metadata = metadata;
		this.settings = settings;
	}

	gatherTags():string[] {
		let tags:string[] = [];
		tags = tags.concat(this.settings.generalTags);

		if(this.settings.noteTags) {
			const parser = new FrontmatterParser(this.markdown);
			if (parser.hasFrontmatter(FRONTMATTER_KEYS.tags)) {
				tags = tags.concat(parser.getFrontmatter(FRONTMATTER_KEYS.tags)?.getValue() || []);
			}

			// Omit the #
			tags = this.metadata.tags !== undefined
				? tags.concat(this.metadata.tags?.map((t) => t.tag.substring(1)))
				: tags;
		}

		return tags;
	}
}