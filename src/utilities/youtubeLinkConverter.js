/**
 * Converts a regular youtube URL to one that can be played in an Iframe
 * @param {*} url
 */
const youtubeLinkConverter = url => {
	return url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
};

export default youtubeLinkConverter;
