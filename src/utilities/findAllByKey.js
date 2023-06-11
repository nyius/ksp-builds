/**
 * Takes in an object and returns all elements with a specific key
 * @param {obj} obj
 * @param {string} keyToFind
 * @returns
 */
const findAllByKey = (obj, keyToFind) => {
	return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind ? acc.concat(value) : typeof value === 'object' ? acc.concat(findAllByKey(value, keyToFind)) : acc), []);
};

export default findAllByKey;
