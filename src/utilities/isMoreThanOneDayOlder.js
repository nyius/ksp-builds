const isMoreThanOneDayOlder = timestamp1 => {
	// Convert timestamps to milliseconds
	const timestamp1Ms = timestamp1 * 1000;

	// Create Date objects
	const date1 = new Date(timestamp1Ms);
	const currentDate = Date.now();

	// Calculate the difference in days
	const differenceInDays = (currentDate - date1) / (24 * 60 * 60 * 1000);

	// Check if the difference is greater than 1 day
	return differenceInDays > 1;
};

export default isMoreThanOneDayOlder;
