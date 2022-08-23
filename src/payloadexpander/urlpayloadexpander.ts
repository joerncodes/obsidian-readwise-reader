import PayloadExpanderInterface from "./payloadexpanderinterface";
import ReaderPayload from "../readerpayload";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";
import URLStrategyInterface from "../urlstrategy/urlstrategyinterface";
import BasicUrlStrategy from "../urlstrategy/basicurlstrategy";
import {FRONT_MATTER_KEYS, OBSIDIAN_TO_READER_URL} from "../constants";
import FrontmatterParser from "../frontmatter/frontmatterparser";
import StringFrontmatterEntry from "../frontmatter/stringfrontmatterentry";

export default class URLPayloadExpander implements PayloadExpanderInterface {
	private urlStrategy:URLStrategyInterface;

	constructor() {
		this.urlStrategy = new BasicUrlStrategy(OBSIDIAN_TO_READER_URL);
	}

	expandPayload(settings:ObsidianToReaderSettingsInterface, payload: ReaderPayload, markdown: string): ReaderPayload {
		payload.url = this.urlStrategy.getUrl();

		const parser = new FrontmatterParser(markdown);

		if(parser.hasFrontmatter(FRONT_MATTER_KEYS.source)) {
			const fm = parser.getFrontmatter(FRONT_MATTER_KEYS.source) as StringFrontmatterEntry;
			payload.url = fm.getValue();
		}

		return payload;
	}

	setUrlStrategy(urlStrategy:URLStrategyInterface): URLPayloadExpander {
		this.urlStrategy = urlStrategy;
		return this;
	}

}
