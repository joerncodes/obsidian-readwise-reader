import {ObsidianToReaderSettings} from "../settings/settings";
import ReaderPayload from "../readerpayload";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";

export default interface PayloadExpanderInterface {
	expandPayload(settings:ObsidianToReaderSettingsInterface, payload:ReaderPayload, markdown: string):ReaderPayload;
}
