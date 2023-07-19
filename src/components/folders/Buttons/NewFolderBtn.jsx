import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { setMakingNewFolder } from '../../../context/folders/FoldersActions';
import { FaPlus } from 'react-icons/fa';

/**
 * Displays the button for making a new folder
 * @returns
 */
function NewFolderBtn() {
	const { user } = useAuthContext();
	const { openedFolder, dispatchFolders, folderView } = useFoldersContext();

	if (user?.folders?.length <= 20 && !openedFolder) {
		return (
			<div className="tooltip" data-tip="New Folder">
				<label
					className={`text-5xl flex flex-col items-center justify-center cursor-pointer ${folderView === 'list' ? 'h-fit w-full py-2 bg-base-400 ' : 'h-28 aspect-square'} hover:bg-base-200 rounded-xl`}
					onClick={() => setMakingNewFolder(dispatchFolders, true)}
				>
					<FaPlus />
				</label>
			</div>
		);
	}
}

export default NewFolderBtn;
