import React from 'react';
import Button from '../buttons/Button';
import { useFoldersContext } from '../../context/folders/FoldersContext';
import { setDeleteFolder, useDeleteFolder } from '../../context/folders/FoldersActions';
import PlanetHeader from '../header/PlanetHeader';

function DeleteFolderModal() {
	const { dispatchFolders, deleteFolderId, deleteFolderName } = useFoldersContext();
	const { deleteFolder } = useDeleteFolder();

	const handleChange = () => {
		return;
	};

	return (
		<>
			<input type="checkbox" checked={deleteFolderId ? true : false} onChange={handleChange} id="delete-folder-modal" className="modal-toggle" />
			<div className="modal z-1000">
				<div className="modal-box relative">
					<Button htmlFor="delete-folder-modal" style="btn-circle" position="z-50 absolute right-2 top-2" text="X" onClick={() => setDeleteFolder(dispatchFolders, null, null)} />
					<PlanetHeader text="Delete Folder"></PlanetHeader>
					<p className="text-xl 2k:text-3xl text-center mb-10 2k:mb-16 text-slate-100">Are you sure you want to delete the folder '{deleteFolderName}'?</p>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-folder-modal" color="btn-success" text="Cancel" icon="cancel" onClick={() => setDeleteFolder(dispatchFolders, null, null)} />
						<Button htmlFor="delete-folder-modal" color="btn-error" onClick={() => deleteFolder()} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteFolderModal;
