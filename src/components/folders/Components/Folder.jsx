import React, { useState } from 'react';
import { FaFolder, FaFolderMinus, FaFolderPlus, FaSave } from 'react-icons/fa';
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { setNewFolderName, setSelectedFolder, setLongClickStart, setEditingFolderName, setLastSelectedFolder, useHandleFolderInteraction, setPinnedFolder, useAddBuildToFolder } from '../../../context/folders/FoldersActions';
import { checkIfBuildInFolder, checkIfFolderSelected } from '../../../context/folders/FoldersUtilils';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import { useBuildContext } from '../../../context/build/BuildContext';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { setDragBuild } from '../../../context/build/BuildActions';

/**
 * Handles displaying a single folder icon
 * @param {obj} folder - the folder to display
 * @param {bool} editable - if the folder is editable
 * @param {string} type - what type of folder to display (optional, "new" if displaying a new folder)
 * @returns
 */
function Folder({ folder, editable, type, sidebar }) {
	const { dispatchFolders, editingFolder, newFolderName, editingFolderName, buildToAddToFolder, folderView, selectedFolders, folderLocation, pinnedFolder, savingToFolder } = useFoldersContext();
	const { handleFolderClick, handleFolderLongClick, handleFolderBlur, handleFolderKeyPress, handleNewFolderKeyPress, handleNewFolderBlur, checkIfFolderOpen } = useHandleFolderInteraction();
	const { user } = useAuthContext();
	const { addBuildToFolder } = useAddBuildToFolder();
	const { dispatchBuild } = useBuildContext();
	const { dragBuild } = useBuildContext();
	const [hoverFolder, setHoverFolder] = useState(false);
	const [buildAdded, setBuildAdded] = useState(false);

	// Allows an image to be dropped on (for rearranging images)
	const allowDrop = e => {
		e.preventDefault();

		if (sidebar) {
			if (e.target.id === 'folder-your-builds' || e.target.closest('.folder')?.id === 'folder-your-builds') return;
			if (e.target.id.includes('folder')) {
				const folderId = e.target.id.replace('folder-', '');
				if (folderId !== hoverFolder) {
					setHoverFolder(folderId);
				}
			} else {
				const folderId = e.target.closest('.folder').id.replace('folder-', '');
				if (folderId !== hoverFolder) {
					setHoverFolder(folderId);
				}
			}
		}
	};

	/**
	 * Stop highlighting a image square when not dragging over it
	 * @param {*} e
	 */
	const dragExit = e => {
		setHoverFolder(false);
	};

	/**
	 * Handles dropping a image after dragging it
	 * @param {*} e
	 */
	const drop = async e => {
		e.preventDefault();

		if (sidebar) {
			if (e.target.id === 'folder-your-builds' || e.target.closest('.folder').id === 'folder-your-builds') return;

			setBuildAdded(true);
			let droppedId = e.dataTransfer.getData('text');
			await addBuildToFolder(droppedId, folder.id);

			setHoverFolder(null);
			setDragBuild(dispatchBuild, null);

			setTimeout(() => {
				setBuildAdded(false);
			}, 1500);
		}
	};

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
				<input
					type="text"
					className={`input text-lg 2k:text-xl ${newFolderName.length > 50 ? 'text-red' : 'text-white'} bg-base-500`}
					placeholder="Enter folder name"
					autoFocus
					onChange={e => setNewFolderName(dispatchFolders, e.target.value)}
				/>
			</div>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<div
			key={folder.id}
			id={`folder-${folder.id}-tooltip`}
			className={`tooltip rounded-xl box-border border-2 border-transparent
			${sidebar ? 'w-full' : ''}
			${hoverFolder === folder.id ? 'border-dashed !border-slate-500 bg-base-300' : ''}
			`}
			data-tip={folder.folderName}
			onDrop={e => drop(e)}
			onDragOver={e => allowDrop(e)}
			onDragLeave={e => dragExit(e)}
		>
			<div
				id={`folder-${folder.id}`}
				tabIndex={0}
				className={`folder text-5xl 2k:text-6xl flex items-center cursor-pointer relative p-1 rounded-xl
				${sidebar ? '!text-[5rem] 2k:!text-[6rem] flex-col w-full py-5' : ''} 
				${folderView === 'grid' && !sidebar ? `flex-col ${editingFolder && editingFolder.id === folder.id ? 'h-25 2k:h-32 w-60 2k:w-72' : 'w-35 2k:w-45 h-25 2k:h-30'}` : ''} 
				${folderView === 'list' && !sidebar ? `flex-row gap-4 2k:gap-6 w-full h-fit pl-10` : ''} 
				${checkIfFolderOpen(folder.id) ? 'bg-base-100 border-2 border-dashed border-slate-600' : ''}
				${checkIfFolderSelected(folder.id, selectedFolders) && !sidebar ? 'bg-base-200 hover:bg-base-100' : 'hover:bg-base-200'}
				`}
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
					if (pinnedFolder === folder.id) {
						if (checkIfFolderSelected(folder.id, selectedFolders)) {
							setPinnedFolder(dispatchFolders, null);
						}
					}
					if (folderLocation === 'upload' && folder.id !== 'your-builds') {
						setSelectedFolder(dispatchFolders, folder, selectedFolders, buildToAddToFolder);
					} else if (folderLocation !== 'upload') {
						setSelectedFolder(dispatchFolders, folder, selectedFolders, buildToAddToFolder);
					}
				}}
			>
				{buildAdded && savingToFolder === folder.id ? (
					<div className={`transition-all opacity-0 animate-saved rounded-full bg-success text-[#1f222b] absolute top-0 right-0 w-14 aspect-square flex items-center justify-center text-4xl drop-shadow-green`}>
						<FaSave />
					</div>
				) : (
					''
				)}
				{(buildToAddToFolder && !sidebar) || (sidebar && dragBuild) ? <AddToFolderCheckbox folderId={folder.id} /> : null}
				{buildToAddToFolder && !sidebar ? <PinFolderCheckbox folder={folder} /> : null}

				{sidebar && hoverFolder === folder.id ? <> {checkIfBuildInFolder(dragBuild, folder.id, user) ? <FaFolderMinus /> : <FaFolderPlus />}</> : <FaFolder />}

				{editingFolder && editingFolder.id === folder.id ? (
					<input
						type="text"
						className={`input text-lg 2k:text-xl ${editingFolderName.length > 50 ? 'text-red-500' : 'text-white'} bg-base-500 w-58 2k:w-66`}
						defaultValue={folder.folderName}
						autoFocus
						onChange={e => setEditingFolderName(dispatchFolders, e.target.value)}
					/>
				) : (
					<p className="text-lg 2k:text-xl text-white truncate-2 unselectable">{folder.folderName}</p>
				)}

				{buildAdded && savingToFolder === folder.id ? <p className="text-lg 2k:text-xl text-success truncate-2 unselectable font-bold mt-3 ">Saved!</p> : ''}
			</div>
		</div>
	);
}

export default Folder;

/**
 * Displays checkbox for adding a build to a folder
 * @param {string} folderId - the id of the folder
 * @returns
 */
const AddToFolderCheckbox = ({ folderId }) => {
	const { selectedFolders } = useFoldersContext();

	return (
		<div className="absolute top-2 left-2 tooltip" data-tip="Add build to folder">
			<span className="text-white text-2xl 2k:text-3xl hover:text-slate-400">{checkIfFolderSelected(folderId, selectedFolders) ? <MdCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}</span>
		</div>
	);
};

/**
 * Checkbox for pinning a folder to a build.
 * User can only change a pin for their own builds.
 * @param {obj} folder
 * @returns
 */
const PinFolderCheckbox = ({ folder }) => {
	const { dispatchFolders, pinnedFolder, buildToAddToFolder, selectedFolders } = useFoldersContext();
	const { loadedBuild } = useBuildContext();
	const { user } = useAuthContext();

	const handlePinFolderClick = e => {
		e.stopPropagation();
		setPinnedFolder(dispatchFolders, pinnedFolder === folder.id ? null : folder.id);

		if (pinnedFolder !== folder.id) {
			if (!checkIfFolderSelected(folder.id, selectedFolders)) {
				setSelectedFolder(dispatchFolders, folder, selectedFolders, buildToAddToFolder);
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (folder.id !== 'your-builds' && loadedBuild?.uid === user.uid) {
		return (
			<div className="absolute top-2 right-2 tooltip" data-tip={`${pinnedFolder === folder.id ? 'Unpin Folder' : 'Pin Folder (displays this folder on the builds page)'}`}>
				<span className="text-white text-2xl 2k:text-3xl hover:text-slate-400" onClick={handlePinFolderClick}>
					{pinnedFolder === folder.id ? <AiFillPushpin /> : <AiOutlinePushpin />}
				</span>
			</div>
		);
	}
};
