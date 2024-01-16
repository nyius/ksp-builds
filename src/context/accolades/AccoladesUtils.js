import { giveAccoladeAndNotify } from '../../hooks/useGiveAccolade';

/**
 * Handles checking if a user has an accolade
 * @param {string} accoladeToCheck - the id of the accolade to check
 * @param {arr} usersAccoaldes - an array of the users accolades
 * @returns
 */
export const checkIfUserHasAccolade = (accoladeToCheck, usersAccoaldes) => {
	let foundAccolade = false;
	for (let i = 0; i < usersAccoaldes?.length; i++) {
		if (usersAccoaldes[i].id === accoladeToCheck) {
			foundAccolade = true;
			break;
		}
	}
	return foundAccolade;
};

/**
 * Checks if a user has the prerequisites for an accolade thats part of a group (bronze, silver, etc)
 * @param {*} dispatchAuth
 * @param {obj} user - the current user
 * @param {arr} fetchedAccolades - all of the fetched accolades
 * @param {obj} accoladesToCheck - an object containing the accolades to check in this format : { bronze: { id: accoladeIdHere, minPoints: Num } }. minPoints is the minim points needed to unlock that tier (eg. if you wanted a diamond accolade to have 100 challenges completed, put in 100)
 * @param {num} usersCurrentPoints - The amount of points the user currently has to check against
 */
export const checkAndAwardAccoladeGroup = async (dispatchAuth, user, fetchedAccolades, accoladesToGive, usersCurrentPoints) => {
	try {
		for (const tier in accoladesToGive) {
			if (usersCurrentPoints >= accoladesToGive[tier].minPoints) {
				if (!checkIfUserHasAccolade(accoladesToGive[tier].id, user.accolades)) {
					let accoladeToGive = fetchedAccolades?.filter(fetchedAccolade => fetchedAccolade.id === accoladesToGive.diamond.id);
					await giveAccoladeAndNotify(dispatchAuth, [accoladeToGive[0]], user); // diamond accolade
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
};
