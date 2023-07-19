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
		<div className="text-xl 2k:text-2xl text-slate-400">
			submitted {createDateFromFirebaseTimestamp(build?.timestamp?.seconds)} by <UsernameLink username={build.author} uid={build.uid} />
		</div>
	);
}

export default BuildCardUploadDate;
