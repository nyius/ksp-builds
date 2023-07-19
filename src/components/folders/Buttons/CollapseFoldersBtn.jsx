import React from 'react';
import Button from '../../buttons/Button';
import { setCollapsedFolders } from '../../../context/folders/FoldersActions';
import { useFoldersContext } from '../../../context/folders/FoldersContext';

/**
 * Displays the button for collapsing folders.
 * @returns
 */
function CollapseFoldersBtn() {
	const { dispatchFolders, collapsedFolders } = useFoldersContext();

	return <Button tooltip="Collapse Folders" color="btn-ghost" icon={`${collapsedFolders ? 'down2' : 'up2'}`} onClick={() => setCollapsedFolders(dispatchFolders, !collapsedFolders)} />;
}

export default CollapseFoldersBtn;
