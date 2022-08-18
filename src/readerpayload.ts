interface ReaderPayload {
	title: string;
	html: string;
	url: string;
	author?: string;
	should_clean_html?: boolean;
	tags?: [];
}

export default ReaderPayload;
