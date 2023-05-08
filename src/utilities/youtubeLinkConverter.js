/**
 * Takes in a video ID and returns a formatted URL
 * @param {*} id
 */
const youtubeLinkConverter = id => {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

	// Test the URL against the regular expression
	const match = id.match(regExp);

	if (match && match[2].length === 11) {
		return `https://www.youtube.com/embed/${match[2]}`;
	} else {
		return `https://www.youtube.com/embed/${id}`;
	}
};

export default youtubeLinkConverter;
