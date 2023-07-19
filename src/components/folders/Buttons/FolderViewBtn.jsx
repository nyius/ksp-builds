import React from 'react';
import Button from '../../buttons/Button';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { setFolderView } from '../../../context/folders/FoldersActions';

/**
 * Displays the button for changing the folder view (grid/list)
 * @returns
 */
function FolderViewBtn() {
	const { dispatchFolders, folderView } = useFoldersContext();

	if (folderView === 'list') {
		return <Button tooltip="Change to Grid View" color={`btn-ghost ${folderView === 'grid' ? 'text-white' : ''}`} icon="grid" onClick={() => setFolderView(dispatchFolders, 'grid')} />;
	} else if (folderView === 'grid') {
		return <Button tooltip="Change to List View" color={`btn-ghost ${folderView === 'list' ? 'text-white' : ''}`} icon="list" onClick={() => setFolderView(dispatchFolders, 'list')} />;
	}
}

export default FolderViewBtn;
