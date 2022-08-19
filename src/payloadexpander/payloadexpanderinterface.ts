import {ObsidianToReaderSettings} from "../settings";
import ReaderPayload from "../readerpayload";

export default interface PayloadExpanderInterface {
	expandPayload(settings:ObsidianToReaderSettings, payload:ReaderPayload, markdown: string):ReaderPayload;
}
