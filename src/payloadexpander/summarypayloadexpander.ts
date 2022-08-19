import PayloadExpanderInterface from "./payloadexpanderinterface";
import {ObsidianToReaderSettings} from "../settings";
import ReaderPayload from "../readerpayload";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import {FRONTMATTER_KEYS} from "../constants";

export default class SummaryPayloadExpander implements PayloadExpanderInterface {
	expandPayload(settings: ObsidianToReaderSettings, payload: ReaderPayload, markdown: string): ReaderPayload {
		const parser = new FrontmatterParser(markdown);
		if(parser.hasFrontmatter(FRONTMATTER_KEYS.summary)) {
			payload.summary = parser.getFrontmatter(FRONTMATTER_KEYS.summary)?.getValue();
		}

		return payload;
	}
}
