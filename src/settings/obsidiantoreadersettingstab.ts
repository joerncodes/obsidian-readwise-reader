import {App, PluginSettingTab, Setting} from "obsidian";
import ObsidianToReadwiseReader from "../../main";
import {TRIAGE_STATUS} from "../constants";

export default class ObsidianToReaderSettingsTab extends PluginSettingTab {
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
				.setValue(this.plugin.settings.generalTags.join(', ') || '')
				.onChange(async (value) => {
					let tags:string[] = [];

					if(value.length) {
						tags = tags.concat(value.split(','));
						tags = tags.map(tag => { return tag.trim() });
					}

					this.plugin.settings.generalTags = tags;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Save Reader URL in front matter')
			.setDesc('After saving the note to Reader, save the link to the document to the note\'s front matter.')
			.addToggle((t) => {
				t.setValue(this.plugin.settings.frontmatter);
				t.onChange(async (v) => {
					this.plugin.settings.frontmatter = v;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Fallback author')
			.setDesc('If no author front matter could be found, use this value instead.')
			.addText(text => text
				.setPlaceholder('Your name')
				.setValue(this.plugin.settings.fallbackAuthor || '')
				.onChange(async (value) => {
					this.plugin.settings.fallbackAuthor= value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Omit front matter')
			.setDesc('If this is checked, your Obsidian note\'s front matter gets ommited when submitting to Reader. Special keys like author will still get parsed.')
			.addToggle((t) => {
				t.setValue(this.plugin.settings.omitFrontmatter);
				t.onChange(async(v) => {
					this.plugin.settings.omitFrontmatter = v;
					await this.plugin.saveSettings();
				})
			});

		new Setting(containerEl)
			.setName('Submit note tags')
			.setDesc('If this is checked, the tags from your Obsidian note will get submitted as Reader tags.')
			.addToggle((t) => {
				t.setValue(this.plugin.settings.noteTags);
				t.onChange(async(v) => {
					this.plugin.settings.noteTags = v;
					await this.plugin.saveSettings();
				})
			});

		new Setting(containerEl)
			.setName('Triage status')
			.setDesc('Choose what triage status to submit to Reader (this concerns the tab your document shows up in).')
			.addDropdown((d) => {
				d.addOption(TRIAGE_STATUS.statusNew, "New (Inbox)");
				d.addOption(TRIAGE_STATUS.statusLater, "Later");
				d.addOption(TRIAGE_STATUS.statusArchive, "Archive");
				d.addOption(TRIAGE_STATUS.statusFeed, "Feed");
				d.setValue(this.plugin.settings.triageStatus);
				d.onChange(async (v: 'new' | 'later' | 'archive' | 'feed') => {
						this.plugin.settings.triageStatus = v;
						this.display();
						await this.plugin.saveSettings();
					}
				);
			});

	}
}
