import {ObsidianToReaderSettings} from "../settings/settings";
import ReaderPayload from "../readerpayload";

export default interface PayloadExpanderInterface {
	expandPayload(settings:ObsidianToReaderSettings, payload:ReaderPayload, markdown: string):ReaderPayload;
}
