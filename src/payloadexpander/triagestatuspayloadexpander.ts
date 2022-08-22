import PayloadExpanderInterface from "./payloadexpanderinterface";
import ReaderPayload from "../readerpayload";
import ObsidianToReaderSettingsInterface from "../settings/obsidiantoreadersettingsinterface";
import {TRIAGE_STATUS} from "../constants";

export default class TriageStatusPayloadExpander implements PayloadExpanderInterface {
	expandPayload(settings:ObsidianToReaderSettingsInterface, payload: ReaderPayload, markdown: string): ReaderPayload {
		payload.triage_status = settings.triageStatus || TRIAGE_STATUS.statusNew;

		return payload;
	}
}
