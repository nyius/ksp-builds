import React, { useContext, useEffect } from 'react';
import Button from '../buttons/Button';
import FoldersContext from '../../context/folders/FoldersContext';
import { setDeleteFolderId, useDeleteFolder } from '../../context/folders/FoldersActions';

function DeleteFolderModal() {
	const { dispatchFolders, deleteFolderId } = useContext(FoldersContext);
	const { deleteFolder } = useDeleteFolder();

	return (
		<>
			<input type="checkbox" checked={deleteFolderId ? true : false} id="delete-folder-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<Button htmlFor="delete-folder-modal" style="btn-circle" position="absolute right-2 top-2" text="X" onClick={() => setDeleteFolderId(dispatchFolders, null)} />
					<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete Folder</h3>
					<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this folder?</h4>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-folder-modal" color="btn-success" text="Cancel" icon="cancel" onClick={() => setDeleteFolderId(dispatchFolders, null)} />
						<Button htmlFor="delete-folder-modal" color="btn-error" onClick={() => deleteFolder()} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteFolderModal;
