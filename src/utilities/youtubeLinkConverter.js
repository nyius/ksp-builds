/**
 * Takes in a video ID and returns a formatted URL
 * @param {*} id
 */
const youtubeLinkConverter = id => {
	//https://www.youtube.com/watch?v=aegUUtkvkoY&ab_channel=Ludwig
	const newUrl = `https://www.youtube.com/embed/${id}`;
	return newUrl;
};

export default youtubeLinkConverter;
