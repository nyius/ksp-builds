import React from 'react';

/**
 * Displays a conversations username
 * @param {string} username
 * @returns
 */
function ConvosUsername({ username }) {
	return <p className="text-xl 2k:text-3xl w-1/2 text-white text-ellipsis overflow-hidden">{username}</p>;
}

export default ConvosUsername;
