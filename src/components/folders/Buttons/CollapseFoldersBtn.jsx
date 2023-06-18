import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import { setCollapsedFolders } from '../../../context/folders/FoldersActions';
import FoldersContext from '../../../context/folders/FoldersContext';

/**
 * Displays the button for collapsing folders.
 * @returns
 */
function CollapseFoldersBtn() {
	const { dispatchFolders, collapsedFolders } = useContext(FoldersContext);

	return <Button tooltip="Collapse Folders" color="btn-ghost" icon={`${collapsedFolders ? 'down2' : 'up2'}`} onClick={() => setCollapsedFolders(dispatchFolders, !collapsedFolders)} />;
}

export default CollapseFoldersBtn;
