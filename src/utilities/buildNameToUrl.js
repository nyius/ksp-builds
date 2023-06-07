export const buildNameToUrl = name => {
	const space = new RegExp(' ', 'g');
	const hash = new RegExp('#', 'g');
	const forwardSlash = new RegExp('/', 'g');
	const question = new RegExp(`\\?`, 'g');
	const at = new RegExp(`@`, 'g');

	return name.replace(space, '-').replace(hash, '%23').replace(forwardSlash, '%2F').replace(question, '%3F').replace(at, '%40');
};