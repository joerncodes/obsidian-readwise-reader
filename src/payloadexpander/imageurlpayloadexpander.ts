import PayloadExpanderInterface from "./payloadexpanderinterface";
import {ObsidianToReaderSettings} from "../settings";
import ReaderPayload from "../readerpayload";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import {FRONTMATTER_KEYS} from "../constants";

export default class ImageUrlPayloadExpander implements PayloadExpanderInterface
{
	expandPayload(settings: ObsidianToReaderSettings, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);

		if(parser.hasFrontmatter(FRONTMATTER_KEYS.imageUrl)) {
			payload.image_url = parser.getFrontmatter(FRONTMATTER_KEYS.imageUrl)?.getValue();
		}
		else if(parser.hasFrontmatter(FRONTMATTER_KEYS.banner)) {
			payload.image_url = parser.getFrontmatter(FRONTMATTER_KEYS.banner)?.getValue();
		}
		return payload;
	}
}
