import PayloadExpanderInterface from "./payloadexpanderinterface";
import ReaderPayload from "../readerpayload";
import {FRONT_MATTER_KEYS} from "../constants";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";
import StringFrontmatterEntry from "../frontmatter/stringfrontmatterentry";

export default class AuthorPayloadExpander implements PayloadExpanderInterface {
	expandPayload(settings: ObsidianToReaderSettingsInterface, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);

		if(parser.hasFrontmatter(FRONT_MATTER_KEYS.author)) {
			const fm = parser.getFrontmatter(FRONT_MATTER_KEYS.author) as StringFrontmatterEntry;
			payload.author = fm.getValue();
		} else if(settings.fallbackAuthor) {
			payload.author = settings.fallbackAuthor;
		}

		return payload;
	}
}
