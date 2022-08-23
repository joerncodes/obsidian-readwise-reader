import {ObsidianToReaderSettings} from "../settings/settings";
import ReaderPayload from "../readerpayload";
import PayloadExpanderInterface from "./payloadexpanderinterface";
import AuthorPayloadExpander from "./authorpayloadexpander";
import ImageUrlPayloadExpander from "./imageurlpayloadexpander";
import SummaryPayloadExpander from "./summarypayloadexpander";
import TriageStatusPayloadExpander from "./triagestatuspayloadexpander";
import URLPayloadExpander from "./urlpayloadexpander";

export default class PayloadExpander implements PayloadExpanderInterface {
	private expanders:PayloadExpanderInterface[] = [];

	constructor() {
		this.expanders.push(new AuthorPayloadExpander());
		this.expanders.push(new ImageUrlPayloadExpander());
		this.expanders.push(new SummaryPayloadExpander());
		this.expanders.push(new TriageStatusPayloadExpander());
		this.expanders.push(new URLPayloadExpander());
	}

	getExpanderByClassname(classname:string):PayloadExpanderInterface {
		for(const expander of this.expanders) {
			if(expander.constructor.name === classname) {
				return expander;
			}
		}

		throw new Error('No implementation found for classname ' + classname);
	}

	expandPayload(settings: ObsidianToReaderSettings, payload: ReaderPayload, markdown: string): ReaderPayload {
		this.expanders.map((expander) => {
			payload = expander.expandPayload(settings, payload, markdown);
		});

		return payload;
	}
}
