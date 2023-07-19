/**
 * Creates a formatted date string from a firebase timestamp
 * @param {*} timestampSeconds - the seconds value from a firebase timestamp
 * @param {string} format - "Long" to get a longer timestamp that includes the hour/minute
 * @returns
 */
export const createDateFromFirebaseTimestamp = (timestampSeconds, format) => {
	if (format === 'long') {
		return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestampSeconds * 1000);
	} else {
		return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(timestampSeconds * 1000);
	}
};
