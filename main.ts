import {
	App,
	Editor, FileView,
	MarkdownRenderer,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab, request,
	requestUrl, RequestUrlParam,
	Setting, TFile
} from 'obsidian';
import ReaderPayload from "./src/readerpayload";
import {
	FRONTMATTER_KEYS, NOTICE_SAVED_SUCCEFULLY,
	NOTICE_TEXT_NO_ACCESS_TOKEN,
	OBSIDIAN_TO_READER_REWRITE_URL, PLUGIN_NAME,
	READER_API_URL,
	TEXT_TITLE_NOT_FOUND
} from "./src/constants";
import ObsidianToReaderSettingTab, {DEFAULT_SETTINGS, ObsidianToReaderSettings} from "./src/settings";
import FrontmatterParser from "./src/frontmatterparser";
import {EditorView} from "@codemirror/view";
import PayloadExpander from "./src/payloadexpander/payloadexpander";

// Remember to rename these classes and interfaces!

export default class ObsidianToReadwiseReader extends Plugin {
	settings: ObsidianToReaderSettings;

	async onload() {
		await this.loadSettings();

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'obsidian-to-reader-send',
			name: 'Send to Reader',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);

				if (markdownView) {
					if(!checking) {
						if(!this.settings.accessToken) {
							const message = document.createDocumentFragment();
							message.append(
								message.createEl('h3', { text: PLUGIN_NAME}),
								NOTICE_TEXT_NO_ACCESS_TOKEN
							);
							new Notice(message);
							return true;
						}
						this.sendToApi();
					}

					return true;
				}
			}
		});

		this.addCommand({
			id: 'obsidian-to-reader-open',
			name: 'Open document URL in Reader',
			checkCallback: (checking: boolean) => {
				const fileview = this.app.workspace.getActiveViewOfType(FileView);

				// This is a little hack because we can't use asynchronous functions (and wait for the file vault) here.
				const markdown = fileview?.containerEl?.innerText || '';
				const parser = new FrontmatterParser(markdown);

				if(!checking) {
					const url = parser.getFrontmatter(FRONTMATTER_KEYS.readerUrl)?.getValue();
					window.open(url, '_null');
				}

				return parser.hasFrontmatter(FRONTMATTER_KEYS.readerUrl);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianToReaderSettingTab(this.app, this));
	}

	async sendToApi() {
		const file = this.app.workspace.getActiveFile();
		const metadata = this.app.metadataCache.getFileCache(file);
		const markdown = await this.app.vault.read(file);
		const wrapper = document.body.createDiv();

		await MarkdownRenderer.renderMarkdown(markdown, wrapper, file?.path || '', this);

		let payload:ReaderPayload = {
			title: file?.basename ?? TEXT_TITLE_NOT_FOUND,
			html: wrapper.outerHTML,
			url: OBSIDIAN_TO_READER_REWRITE_URL + encodeURIComponent(app.getObsidianUrl(file)),
			tags: this.settings.generalTags
		};

		const payloadExpander = new PayloadExpander();
		payload = payloadExpander.expandPayload(this.settings, payload, markdown);
		console.log(payload);

		const auth = 'Token ' + this.settings.accessToken;

		const requestParameters:RequestUrlParam = {
			url: READER_API_URL,
			method: 'POST',
			contentType: 'application/json',
			body: JSON.stringify(payload),
			headers: {
				'Authorization': auth
			},
		};

		const response = await request(requestParameters);
		const jsonResponse = JSON.parse(response);

		const message = document.createDocumentFragment();
		message.append(
			message.createEl('h3', { text: PLUGIN_NAME}),
			message.createEl('strong', NOTICE_SAVED_SUCCEFULLY.title),
			NOTICE_SAVED_SUCCEFULLY.message,
			message.createEl('br'),
			message.createEl('br'),
			message.createEl('a', {
				'href': jsonResponse.url,
				'text': NOTICE_SAVED_SUCCEFULLY.linkText
			})
		);
		new Notice(message);

		this.saveFrontmatter(file, markdown, jsonResponse.url);
	}

	onunload() {

	}

	saveFrontmatter(file:TFile, markdown:string, url:string) {
		if(!this.settings.frontmatter) {
			return;
		}

		const parser = new FrontmatterParser(markdown);
		parser.setFrontmatter(FRONTMATTER_KEYS.readerUrl, url);
		const result = parser.saveFrontmatter();

		this.app.vault.modify(file, result);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

