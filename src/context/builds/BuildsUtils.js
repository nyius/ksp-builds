/**
 * Handles setting the local storage for the builds view mode
 * @param {obj} build - the build to save to local storage
 */
export const setLocalStoredBuildsView = view => {
	localStorage.setItem('buildsView', JSON.stringify(view));
};
