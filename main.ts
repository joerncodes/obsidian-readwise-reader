import {
	App, CachedMetadata,
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
	DEFAULT_SETTINGS,
	FRONTMATTER_KEYS, NOTICE_SAVED_SUCCEFULLY,
	NOTICE_TEXT_NO_ACCESS_TOKEN,
	OBSIDIAN_TO_READER_REWRITE_URL, PLUGIN_NAME,
	READER_API_URL,
	TEXT_TITLE_NOT_FOUND
} from "./src/constants";
import FrontmatterParser from "./src/frontmatter/frontmatterparser";
import {EditorView} from "@codemirror/view";
import PayloadExpander from "./src/payloadexpander/payloadexpander";
import ObsidianToReaderSettingsInterface from "./src/settings/obsidiantoreadersettingsinterface";
import ObsidianToReaderSettingsTab from "./src/settings/obsidiantoreadersettingstab";

// Remember to rename these classes and interfaces!

export default class ObsidianToReadwiseReader extends Plugin {
	settings: ObsidianToReaderSettingsInterface;

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
		this.addSettingTab(new ObsidianToReaderSettingsTab(this.app, this));
	}

	async sendToApi() {
		const file = this.app.workspace.getActiveFile();
		const metadata = this.app.metadataCache.getFileCache(file);
		const originalMarkdown = await this.app.vault.read(file);
		const wrapper = document.body.createDiv();

		let markdown = originalMarkdown;
		if(this.settings.omitFrontmatter) {
			markdown = (new FrontmatterParser(markdown)).stripFrontmatter();
		}

		await MarkdownRenderer.renderMarkdown(markdown, wrapper, file?.path || '', this);

		const tags = this.gatherTags(originalMarkdown, metadata);

		let payload:ReaderPayload = {
			title: file?.basename ?? TEXT_TITLE_NOT_FOUND,
			html: wrapper.outerHTML,
			url: OBSIDIAN_TO_READER_REWRITE_URL + encodeURIComponent(app.getObsidianUrl(file)),
			tags: tags
		};

		const payloadExpander = new PayloadExpander();
		payload = payloadExpander.expandPayload(this.settings, payload, originalMarkdown);

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

		this.saveFrontmatter(file, originalMarkdown, jsonResponse.url);
	}

	gatherTags(markdown:string, metadata:CachedMetadata): string[] {
		let tags = [];
		tags = tags.concat(this.settings.generalTags);

		console.log(this.settings);
		if(this.settings.noteTags) {
			const parser = new FrontmatterParser(markdown);
			if(parser.hasFrontmatter(FRONTMATTER_KEYS.tags)) {
				tags = tags.concat(parser.getFrontmatter(FRONTMATTER_KEYS.tags)?.getValue() || []);
			}

			// Omit the #
			tags = tags.concat(metadata.tags?.map((t) => t.tag.substring(1)));
		}

		return tags;
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

