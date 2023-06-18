/**
 * handles fetching a build from local storage
 * @param {string} id - the id of the build to get
 */
export const getBuildFromLocalStorage = id => {
	let localBuild = localStorage.getItem(id);
	if (!localBuild) {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const value = localStorage.getItem(key);

			// Check if desired text exists in the value
			if (value.includes(`"urlName":"${id}"`) && value.includes(`"type":"build"`)) {
				localBuild = value;
				break;
			}
		}
	}

	if (localBuild) {
		const build = JSON.parse(localBuild);
		return build;
	}
};

/**
 * Checks if a local fetched build is older than X minutes
 * @param {time} lastFetchedBuildTime - builds fetched time
 * @param {time} time - minutes to check that the build is older than
 * @returns - true if older than X time, false if not
 */
export const checkLocalBuildAge = (lastFetchedBuildTime, time) => {
	const currentTime = new Date();
	const ageToCheck = new Date(currentTime.getTime() - time * 60 * 1000);

	if (new Date(lastFetchedBuildTime) <= ageToCheck) {
		return true;
	} else {
		return false;
	}
};

/**
 * Handles putting the fetched build into the 'all fetched builds' object in the context
 * @param {obj} build - the build to save to local storage
 */
export const setLocalStoredBuild = build => {
	build.lastFetchedTimestamp = new Date();
	localStorage.setItem(build.id, JSON.stringify(build));
};

/**
 * Searches through local storage to try and fing a build based on its name
 * @param {string} name - the name of the build to find in local storage
 */
export const getBuildFromLocalStorageByName = name => {
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		const value = localStorage.getItem(key);

		// Check if desired text exists in the value
		if (value.includes(name)) {
			return JSON.parse(value);
		}
	}
};
