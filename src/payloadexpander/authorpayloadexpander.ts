import PayloadExpanderInterface from "./payloadexpanderinterface";
import {ObsidianToReaderSettings} from "../settings";
import ReaderPayload from "../readerpayload";
import {FRONTMATTER_KEYS} from "../constants";
import FrontmatterParser from "../frontmatterparser";

export default class AuthorPayloadExpander implements PayloadExpanderInterface {
	expandPayload(settings: ObsidianToReaderSettings, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);

		if(parser.hasFrontmatter(FRONTMATTER_KEYS.author)) {
			payload.author = parser.getFrontmatter(FRONTMATTER_KEYS.author)?.getValue();
		} else if(settings.fallbackAuthor) {
			payload.author = settings.fallbackAuthor;
		}

		return payload;
	}
}
