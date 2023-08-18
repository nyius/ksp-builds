import React from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { setFolderLimitModal, setMakingNewFolder } from '../../../context/folders/FoldersActions';
import { FaPlus } from 'react-icons/fa';
import { useCheckMinSubscriptionTier } from '../../../context/auth/AuthActions';

/**
 * Displays the button for making a new folder
 * @returns
 */
function NewFolderBtn() {
	const { user } = useAuthContext();
	const { openedFolder, dispatchFolders, folderView } = useFoldersContext();
	const { checkMinSubscriptionTier } = useCheckMinSubscriptionTier();

	const handleMakeNewFolder = () => {
		if (user?.folders?.length < 5 || (checkMinSubscriptionTier(1) && user?.folders?.length < 6)) {
			setMakingNewFolder(dispatchFolders, true);
		} else if (checkMinSubscriptionTier(1) && user?.folders?.length === 6) {
			setFolderLimitModal(dispatchFolders, true);
		}
	};

	if (!openedFolder) {
		return (
			<div className="tooltip" data-tip="New Folder">
				<label className={`text-5xl flex flex-col items-center justify-center cursor-pointer ${folderView === 'list' ? 'h-fit w-full py-2 bg-base-400 ' : 'h-28 aspect-square'} hover:bg-base-200 rounded-xl`} onClick={handleMakeNewFolder}>
					<FaPlus />
				</label>
			</div>
		);
	}
}

export default NewFolderBtn;
