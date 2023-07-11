import React from 'react';
import UsernameLink from '../../../username/UsernameLink';

/**
 * Displays the builds upload date and additional text
 * @param {obj} build - the build object
 * @returns
 */
function BuildCardUploadDate({ build }) {
	const createDate = timestamp => {
		return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(timestamp.seconds * 1000);
	};

	return (
		<div className="text-lg 2k:text-xl text-slate-400">
			submitted {createDate(build.timestamp)} by <UsernameLink css="!text-lg 2k:!text-xl" noHoverUi={true} username={build.author} uid={build.uid} />
		</div>
	);
}

export default BuildCardUploadDate;
