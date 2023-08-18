import React from 'react';
import { checkIfBuildInAllFolders } from '../../../../context/folders/FoldersUtilils';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import { FaSave } from 'react-icons/fa';

/**
 * Displays a builds download count
 * @param {int} downloads
 * @returns
 */
function BuildCardSaved({ id }) {
	const { user } = useAuthContext();

	if (checkIfBuildInAllFolders(id, user)) {
		return (
			<div className="flex flex-row items-center gap-2 text-xl 2k:text-2xl text-slate-400">
				<FaSave /> Saved
			</div>
		);
	}
}

export default BuildCardSaved;
