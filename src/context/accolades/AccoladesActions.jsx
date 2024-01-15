// State Setters---------------------------------------------------------------------------------------------------//

/**
 * Handles adding a new accolade
 * @param {*} dispatchAccolades
 * @param {*} accolade
 */
export const addNewAccolade = (dispatchAccolades, accolade) => {
	dispatchAccolades({
		type: 'ADD_NEW_ACCOLADE',
		payload: accolade,
	});
};

/**
 * Handles removing an accolade
 * @param {*} dispatchAccolades
 * @param {*} accoladeId
 */
export const deleteAccolade = (dispatchAccolades, accoladeId) => {
	dispatchAccolades({
		type: 'DELETE_ACCOLADE',
		payload: accoladeId,
	});
};

/**
 * Handles updating an accolade
 * @param {*} dispatchAccolades
 * @param {*} accolade
 */
export const updateAccolade = (dispatchAccolades, accolade) => {
	dispatchAccolades({
		type: 'UPDATE_ACCOLADE',
		payload: accolade,
	});
};

/**
 * Handles setting the accolade to view in the accolades viewer modal
 * @param {*} dispatchAccolades
 * @param {*} accolade
 */
export const setAccoladeViewer = (dispatchAccolades, accolade) => {
	dispatchAccolades({
		type: 'SET_ACCOLADE_VIEWER',
		payload: accolade,
	});
};
