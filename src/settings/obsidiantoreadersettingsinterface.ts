export default interface ObsidianToReaderSettingsInterface {
	accessToken: string;
	generalTags: string[];
	frontmatter: boolean;
	omitFrontmatter: boolean;
	fallbackAuthor?: string;
}
