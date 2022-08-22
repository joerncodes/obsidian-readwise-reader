interface ReaderPayload {
	title: string;
	html: string;
	url: string;
	triage_status?: string;
	author?: string;
	should_clean_html?: boolean;
	tags?: string[];
	image_url?: string;
	summary?: string;
}

export default ReaderPayload;
