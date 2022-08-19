import {ObsidianToReaderSettings} from "../settings";
import ReaderPayload from "../readerpayload";
import PayloadExpanderInterface from "./payloadexpanderinterface";
import AuthorPayloadExpander from "./authorpayloadexpander";
import ImageUrlPayloadExpander from "./imageurlpayloadexpander";

export default class PayloadExpander implements PayloadExpanderInterface {
	private expanders:PayloadExpanderInterface[] = [];

	constructor() {
		this.expanders.push(new AuthorPayloadExpander());
		this.expanders.push(new ImageUrlPayloadExpander());
	}


	expandPayload(settings: ObsidianToReaderSettings, payload: ReaderPayload, markdown: string): ReaderPayload {
		this.expanders.map((expander) => {
			payload = expander.expandPayload(settings, payload, markdown);
		});

		return payload;
	}
}
