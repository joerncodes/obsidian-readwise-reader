import URLStrategyInterface from "./urlstrategyinterface";

export default class BasicUrlStrategy implements URLStrategyInterface {
	private url:string;

	constructor(url:string) {
		this.url = url;
	}

	getUrl(): string {
		return this.url;
	}

}
