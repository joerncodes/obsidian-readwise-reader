import {
	App,
	Editor,
	MarkdownRenderer,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab, request,
	requestUrl, RequestUrlParam,
	Setting
} from 'obsidian';
import ReaderPayload from "./src/readerpayload";
import {READER_API_URL, TEXT_TITLE_NOT_FOUND} from "./src/constants";

// Remember to rename these classes and interfaces!

interface ObsidianToReaderSettings {
	accessToken: string;
	generalTags: [];
}

const DEFAULT_SETTINGS: ObsidianToReaderSettings = {
	accessToken: '',
	generalTags: []
}

export default class ObsidianToReadwiseReader extends Plugin {
	settings: ObsidianToReaderSettings;

	async onload() {
		await this.loadSettings();

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'obsidian-to-readwise-reader-send',
			name: 'Send to Reader',
			callback: async () => {
				await this.sendToApi();
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
			url: 'https://obsidiantoreader.com',
			tags: this.settings.generalTags
		};

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
		new Notice('Saved document to ' + jsonResponse.url);
	}

	onunload() {

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

class ObsidianToReaderSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Obsidian to Reader settings'});
		let desc = document.createDocumentFragment();
		desc.append(
			'In order to use this plugin, ',
			desc.createEl('strong', { text: 'you must have access to the Reader beta.'}),
			desc.createEl('br'),
			desc.createEl('br'),
		);
		containerEl.appendChild(desc);

		desc = document.createDocumentFragment();
		desc.append(
			'Your Reader access token. You can find yours at ',
			desc.createEl('a', {
				href: 'https://readwise.io/access_token',
				text: 'https://readwise.io/access_token'
			}),
			'.',
			desc.createEl('br'),
		);

		new Setting(containerEl)
			.setName('Access token')
			.setDesc(desc)
			.addText(text => text
				.setPlaceholder('Enter access token')
				.setValue(this.plugin.settings.accessToken)
				.onChange(async (value) => {
					this.plugin.settings.accessToken = value;
					await this.plugin.saveSettings();
				}));

		desc = document.createDocumentFragment();
		desc.append(
			'A list of tags that will always get appended to your newly created Reader document.',
			desc.createEl('br'),
			'Please provide a comma-seperated list, without the # sign.'
		);
		new Setting(containerEl)
			.setName('General tags')
			.setDesc(desc)
			.addText(text => text
				.setPlaceholder('obsidian, plugin')
				.setValue(this.plugin.settings.generalTags.join(', ') || null)
				.onChange(async (value) => {
					let tags = [];

					if(value.length) {
						tags = tags.concat(value.split(','));
						tags = tags.map(tag => { return tag.trim() });
					}

					this.plugin.settings.generalTags = tags;
					await this.plugin.saveSettings();
				}));
	}
}
