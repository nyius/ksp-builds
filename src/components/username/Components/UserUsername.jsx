import React from 'react';

/**
 * Displays the users username
 * @param {string} username
 * @returns
 */
function UserUsername({ username, customUsernameColor }) {
	return (
		<p className="text-xl 2k:text-2xl text-white font-bold" style={customUsernameColor ? { color: `${customUsernameColor}` } : null}>
			{username}
		</p>
	);
}

export default UserUsername;
