import { toast } from 'react-toastify';

/**
 * Handles copying the hangars URL to clipboard for sharing
 * @param {*} username - a users ID/username.
 * @param {*} hangarUrl
 */
export const handleShareHangar = (username, hangarUrlName) => {
	if (!hangarUrlName) {
		const hangarUrl = `kspbuilds.com/user/${username}`;
		navigator.clipboard.writeText(hangarUrl);
	} else {
		const hangarUrl = `kspbuilds.com/user/${username}/hangar/${hangarUrlName}`;
		navigator.clipboard.writeText(hangarUrl);
		toast.success('Copied URL to clipboard!');
	}
};

/**
 * Checks if a build is in the current users hangar
 * @param {string} buildId - ID of build to look for
 * @param {string} hangarId - ID of hangar to look in
 * @param {obj} user - The current logged in user
 */
export const checkIfBuildInHangar = (buildId, hangarId, user) => {
	const hangarIndex = user.hangars.findIndex(hangar => hangar.id === hangarId);

	if (hangarIndex >= 0) {
		return user.hangars[hangarIndex].builds.includes(buildId);
	}
};

/**
 * Checks if a build is in any of the current users hangars
 * @param {string} buildId - ID of build to look for
 * @param {obj} user - The current logged in user
 */
export const checkIfBuildInAllHangars = (buildId, user) => {
	const hangarIndex = user?.hangars?.findIndex(hanger => hanger.builds.includes(buildId));

	return hangarIndex >= 0;
};

/**
 * Checks if a hangar is currently selected. Returns its index position
 * @param {string} hangarId - the ID of the hangar to check
 * @param {arr} selectedHangars - array of currently selected hangars
 */
export const checkIfHangarSelected = (hangarId, selectedHangars) => {
	let hangarIndex = selectedHangars.findIndex(hangar => hangar.id === hangarId);
	if (hangarId === 'your-builds') hangarIndex = 1;

	return hangarIndex >= 0;
};

/**
 * Checks an array of hangars and returns the number of times a name appears
 * @param {arr} hangars
 * @param {string} nameToCheck
 * @returns
 */
export const checkForSameNameHangar = (hangars, nameToCheck) => {
	let sameNameCount = 0;
	hangars.map(hangar => {
		if (hangar.hangarName === nameToCheck) {
			sameNameCount++;
		}
	});
	return sameNameCount;
};
