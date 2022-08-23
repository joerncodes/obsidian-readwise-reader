import PayloadExpanderInterface from "./payloadexpanderinterface";
import ReaderPayload from "../readerpayload";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import {FRONT_MATTER_KEYS} from "../constants";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";
import StringFrontmatterEntry from "../frontmatter/stringfrontmatterentry";

export default class SummaryPayloadExpander implements PayloadExpanderInterface {
	expandPayload(settings: ObsidianToReaderSettingsInterface, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);
		if(parser.hasFrontmatter(FRONT_MATTER_KEYS.summary)) {
			const fm = parser.getFrontmatter(FRONT_MATTER_KEYS.summary) as StringFrontmatterEntry;
			payload.summary = fm.getValue();
		}

		return payload;
	}
}
