const getBuildPartCount = buildString => {
	if (!buildString) return 0;
	let count = (buildString.match(/partState/g) || []).length;
	return count;
};

export default getBuildPartCount;
