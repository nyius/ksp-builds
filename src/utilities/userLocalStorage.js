/**
 * handles fetching a user from local storage
 * @param {string} id - the uid/username of the user to get
 */
export const getUserFromLocalStorage = id => {
	let localUser = localStorage.getItem(id);

	if (!localUser) {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const value = localStorage.getItem(key);

			// Check if desired text exists in the value
			if (value.includes(`"username":"${id}"`) && value.includes(`"type":"userProfile"`)) {
				localUser = value;
				break;
			}
		}
	}

	if (localUser) {
		const user = JSON.parse(localUser);
		return user;
	}
};

/**
 * Checks if a local fetched user is older than X minutes
 * @param {time} lastFetchedUserTime - users fetched time
 * @param {time} time - minutes to check that the user is older than
 * @returns - true if older than X time, false if not
 */
export const checkLocalUserAge = (lastFetchedUserTime, time) => {
	const currentTime = new Date();
	const ageToCheck = new Date(currentTime.getTime() - time * 60 * 1000);

	if (new Date(lastFetchedUserTime) <= ageToCheck) {
		return true;
	} else {
		return false;
	}
};

/**
 * Handles storing the user in localstorage. Stringifies the user.
 * @param {obj} user - the user to save to local storage
 */
export const setLocalStoredUser = (id, user) => {
	user.lastFetchedTimestamp = new Date();
	localStorage.setItem(id, JSON.stringify(user));
};
