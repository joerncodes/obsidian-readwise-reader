import PayloadExpanderInterface from "./payloadexpanderinterface";
import ReaderPayload from "../readerpayload";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import {FRONT_MATTER_KEYS} from "../constants";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";
import StringFrontmatterEntry from "../frontmatter/stringfrontmatterentry";

export default class ImageUrlPayloadExpander implements PayloadExpanderInterface
{
	expandPayload(settings: ObsidianToReaderSettingsInterface, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);

		if(parser.hasFrontmatter(FRONT_MATTER_KEYS.imageUrl)) {
			const fm = parser.getFrontmatter(FRONT_MATTER_KEYS.imageUrl) as StringFrontmatterEntry;
			payload.image_url = fm.getValue();
		}
		else if(parser.hasFrontmatter(FRONT_MATTER_KEYS.banner)) {
			const fm = parser.getFrontmatter(FRONT_MATTER_KEYS.banner) as StringFrontmatterEntry;
			payload.image_url = fm.getValue();
		}
		return payload;
	}
}
