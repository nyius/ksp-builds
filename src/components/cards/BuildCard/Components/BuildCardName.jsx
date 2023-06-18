import React from 'react';

/**
 * Displays the builds name
 * @param {string} name
 * @returns
 */
function BuildCardName({ name }) {
	return <h2 className="card-title text-white build-title-truncate 2k:text-2xl mb-2 2k:mb-4 ">{name}</h2>;
}

export default BuildCardName;
