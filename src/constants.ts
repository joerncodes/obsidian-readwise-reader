import ObsidianToReaderSettingsInterface from "./settings/obsidiantoreadersettingsinterface";

export const READER_API_URL = 'https://readwise.io/api/v3/save';
export const OBSIDIAN_TO_READER_URL = 'https://obsidiantoreader.com';
export const OBSIDIAN_TO_READER_REWRITE_URL = 'https://obsidiantoreader.com/to?url=';
export const TEXT_TITLE_NOT_FOUND = 'Obsidian title could not be found.';
export const PLUGIN_NAME = 'Obsidian to Reader';
export const NOTICE_SAVED_SUCCEFULLY = {
	title: 'Success!',
	message: 'Your document was successfully saved to Reader.',
	linkText: '➡️ Open in Reader'
};
export const NOTICE_TEXT_NO_ACCESS_TOKEN = 'No access token was found. Please set your access token in the settings.';
export const FRONTMATTER_KEYS = {
	readerUrl: 'reader-url',
	author: 'author',
	banner: 'banner',
	imageUrl: 'image-url',
	summary: 'summary',
	tags: 'tags',
	source: 'source',
};

export const TRIAGE_STATUS = {
	statusNew: 'new',
	statusLater: 'later',
	statusArchive: 'archive',
	statusFeed: 'feed'
};

export const DEFAULT_SETTINGS: ObsidianToReaderSettingsInterface = {
	accessToken: '',
	generalTags: [],
	frontmatter: false,
	omitFrontmatter: true,
	noteTags: false,
	triageStatus: TRIAGE_STATUS.statusNew,
}

