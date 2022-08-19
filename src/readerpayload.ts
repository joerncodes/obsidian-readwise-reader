interface ReaderPayload {
	title: string;
	html: string;
	url: string;
	author?: string;
	should_clean_html?: boolean;
	tags?: [];
	image_url?: string;
	summary?: string;
}

export default ReaderPayload;
