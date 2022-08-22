import ReaderPayload from "../../src/readerpayload";
import ObsidianToReaderSettingsInterface from "../../src/settings/obsidiantoreadersettingsinterface";
import {DEFAULT_SETTINGS, TRIAGE_STATUS} from "../../src/constants";
import TriageStatusPayloadExpander from "../../src/payloadexpander/triagestatuspayloadexpander";

const expander = new TriageStatusPayloadExpander();

const markdown = '# A Test';
let payload:ReaderPayload = {
	title: 'A test',
	html: '<h1>A test</h1>',
	url: 'https://obsidiantoreader.com'
};
let settings:ObsidianToReaderSettingsInterface = {...DEFAULT_SETTINGS};

test('Standard triage_status is "new"', () => {
	payload = expander.expandPayload(settings, payload, markdown);

	expect(payload.triage_status).toEqual('new');
 });

test('Payload expander reads settings and submits status', () => {
	settings.triageStatus = TRIAGE_STATUS.statusLater;

	payload = expander.expandPayload(settings, payload, markdown);

	expect(payload.triage_status).toEqual(TRIAGE_STATUS.statusLater);

});
