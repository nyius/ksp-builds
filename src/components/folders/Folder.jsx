import React, { useState, useContext, useEffect } from 'react';
import { FaFolder } from 'react-icons/fa';
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import FoldersContext from '../../context/folders/FoldersContext';
import { setNewFolderName, setSelectedFolder, setLongClickStart, setEditingFolderName, setLastSelectedFolder, useHandleFolderInteraction } from '../../context/folders/FoldersActions';
import { checkIfFolderSelected } from '../../context/folders/FoldersUtilils';

/**
 * Handles displaying a single folder icon
 * @param {*} folder
 * @returns
 */
function Folder({ folder, editable, type }) {
	const { dispatchFolders, editingFolder, buildToAddToFolder, folderView, selectedFolders } = useContext(FoldersContext);
	const { handleFolderClick, handleFolderLongClick, handleFolderBlur, handleFolderKeyPress, handleNewFolderKeyPress, handleNewFolderBlur, checkIfFolderOpen } = useHandleFolderInteraction();

	if (type === 'new' && !folder) {
		return (
			<div
				tabIndex={0}
				className={`text-6xl flex ${folderView === 'grid' && `flex-col`} ${folderView === 'list' && `flex-row gap-4 2k:gap-6 w-full h-fit`} items-center cursor-pointer relative h-32 w-72 p-1 hover:bg-base-200 rounded-xl`}
				onKeyDown={e => handleNewFolderKeyPress(e)}
				onBlur={e => {
					handleNewFolderBlur(e);
				}}
			>
				<FaFolder />
				<input type="text" className="input text-lg 2k:text-xl text-white bg-base-500" placeholder="Enter folder name" autoFocus onChange={e => setNewFolderName(dispatchFolders, e.target.value)} />
			</div>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<div key={folder.id} className="tooltip" data-tip={folder.folderName}>
			<div
				id={`folder-${folder.id}`}
				tabIndex={0}
				className={`text-5xl 2k:text-6xl flex ${folderView === 'grid' && `flex-col ${editingFolder && editingFolder.id === folder.id ? 'h-25 2k:h-32 w-60 2k:w-72' : 'w-35 2k:w-45 h-25 2k:h-30'}`}  ${
					folderView === 'list' && `flex-row gap-4 2k:gap-6 w-full h-fit pl-10`
				} items-center cursor-pointer relative p-1 ${checkIfFolderOpen(folder.id) ? 'bg-base-100' : ''} ${checkIfFolderSelected(folder.id, selectedFolders) ? 'bg-base-200 hover:bg-base-100' : 'hover:bg-base-200'} rounded-xl`}
				onMouseDown={() => {
					if (editable && !buildToAddToFolder) {
						setLongClickStart(dispatchFolders, new Date().getTime());
					}
				}}
				onMouseUp={() => {
					if (editable && !buildToAddToFolder) {
						handleFolderLongClick(folder);
					}
				}}
				onBlur={e => {
					if (editable && !buildToAddToFolder) {
						handleFolderBlur(e, folder);
					}
				}}
				onKeyDown={e => {
					if (editable) {
						handleFolderKeyPress(e, folder);
					}
				}}
				onClick={() => {
					handleFolderClick(folder);
					setLastSelectedFolder(dispatchFolders, folder.id);
					setSelectedFolder(dispatchFolders, folder, selectedFolders, buildToAddToFolder);
				}}
			>
				{buildToAddToFolder ? <span className="absolute top-2 left-2 text-white text-2xl 2k:text-3xl">{checkIfFolderSelected(folder.id, selectedFolders) ? <MdCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}</span> : null}

				<FaFolder />

				{editingFolder && editingFolder.id === folder.id ? (
					<input type="text" className="input text-lg 2k:text-xl text-white bg-base-500 w-58 2k:w-66" defaultValue={folder.folderName} autoFocus onChange={e => setEditingFolderName(dispatchFolders, e.target.value)} />
				) : (
					<p className="text-lg 2k:text-xl text-white truncate-2 unselectable">{folder.folderName}</p>
				)}
			</div>
		</div>
	);
}

export default Folder;
