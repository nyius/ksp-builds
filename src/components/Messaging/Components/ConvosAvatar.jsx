import React from 'react';

/**
 * Displays the users avatar in the list of convos
 * @param {*} profilePicture
 * @returns
 */
function ConvosAvatar({ profilePicture }) {
	return (
		<div className="avatar">
			<div className="rounded-full w-24">
				<img src={profilePicture} alt="" />
			</div>
		</div>
	);
}

export default ConvosAvatar;
