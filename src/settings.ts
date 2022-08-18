import {App, PluginSettingTab, Setting} from "obsidian";
import ObsidianToReadwiseReader from "../main";


export interface ObsidianToReaderSettings {
	accessToken: string;
	generalTags: [];
	frontmatter: boolean;
}

export const DEFAULT_SETTINGS: ObsidianToReaderSettings = {
	accessToken: '',
	generalTags: [],
	frontmatter: false
}


export default class ObsidianToReaderSettingTab extends PluginSettingTab {
	plugin: ObsidianToReadwiseReader;

	constructor(app: App, plugin: ObsidianToReadwiseReader) {
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

		new Setting(containerEl)
			.setName('Save Reader URL in frontmatter')
			.setDesc('After saving the note to Reader, save the link to the document to the note\'s frontmatter.')
			.addToggle((t) => {
				t.setValue(this.plugin.settings.frontmatter);
				t.onChange(async (v) => {
					this.plugin.settings.frontmatter = v;
					await this.plugin.saveSettings();
				});
			});

	}
}