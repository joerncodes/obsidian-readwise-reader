import URLStrategyInterface from "./urlstrategyinterface";
import ObsidianURLPartsInterface from "./obsidianurlpartsinterface";
import {OBSIDIAN_TO_READER_REWRITE_URL} from "../constants";

export default class ObsidianURLStrategy implements URLStrategyInterface {
	private urlPartsInterface:ObsidianURLPartsInterface;

	constructor(urlPartsInterface:ObsidianURLPartsInterface) {
		this.urlPartsInterface = urlPartsInterface;
	}

	getUrl(): string {
		const vault = encodeURIComponent(this.urlPartsInterface.vault.getName());
		const basename = encodeURIComponent(this.urlPartsInterface.basename);

		const url = OBSIDIAN_TO_READER_REWRITE_URL + encodeURIComponent('obsidian://open?vault=' + vault + '&file=' + basename);

		return url;
	}

}
