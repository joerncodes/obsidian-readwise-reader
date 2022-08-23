import {CachedMetadata, TagCache} from "obsidian";
import FrontmatterParser from "./frontmatter/frontmatterparser";
import {FRONT_MATTER_KEYS} from "./constants";
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
			if (parser.hasFrontmatter(FRONT_MATTER_KEYS.tags)) {
				tags = tags.concat(parser.getFrontmatter(FRONT_MATTER_KEYS.tags)?.getValue() || []);
			}

			// Omit the #
			if(this.metadata.tags !== undefined) {
				const metadataTags = this.metadata.tags.map((t:TagCache) => {
					return t.tag.startsWith('#')
						? t.tag.substring(1)
						: t.tag;
				});
				tags = tags.concat(metadataTags);
			}
		}

		return tags;
	}
}
