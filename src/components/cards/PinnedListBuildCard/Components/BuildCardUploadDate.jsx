import React from 'react';
import UsernameLink from '../../../username/UsernameLink';
import { createDateFromFirebaseTimestamp } from '../../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the builds upload date and additional text
 * @param {obj} build - the build object
 * @returns
 */
function BuildCardUploadDate({ build }) {
	return (
		<div className="text-lg 2k:text-xl text-slate-400">
			submitted {createDateFromFirebaseTimestamp(build.timestamp.seconds)} by <UsernameLink css="!text-lg 2k:!text-xl" noHoverUi={true} username={build.author} uid={build.uid} />
		</div>
	);
}

export default BuildCardUploadDate;
