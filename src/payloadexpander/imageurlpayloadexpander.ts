import PayloadExpanderInterface from "./payloadexpanderinterface";
import ReaderPayload from "../readerpayload";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import {FRONTMATTER_KEYS} from "../constants";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";
import StringFrontmatterEntry from "../frontmatter/stringfrontmatterentry";

export default class ImageUrlPayloadExpander implements PayloadExpanderInterface
{
	expandPayload(settings: ObsidianToReaderSettingsInterface, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);

		if(parser.hasFrontmatter(FRONTMATTER_KEYS.imageUrl)) {
			const fm = parser.getFrontmatter(FRONTMATTER_KEYS.imageUrl) as StringFrontmatterEntry;
			payload.image_url = fm.getValue();
		}
		else if(parser.hasFrontmatter(FRONTMATTER_KEYS.banner)) {
			const fm = parser.getFrontmatter(FRONTMATTER_KEYS.banner) as StringFrontmatterEntry;
			payload.image_url = fm.getValue();
		}
		return payload;
	}
}
