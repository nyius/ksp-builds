import DOMpurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';

/**
 * Takes in JSON, converts it to HTML and sanitzes it to be displayed on a page
 * @param {*} html
 * @returns
 */
const createMarkup = json => {
	const html = draftToHtml(JSON.parse(json));

	return {
		__html: DOMpurify.sanitize(html),
	};
};

export default createMarkup;
