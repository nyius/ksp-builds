import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import Folders from '../folders/Folders';
import { setBuildToAddToFolder, setSelectedFolder, setOpenedFolder, setAddBuildToFolderModal, setFolderLocation, setMakingNewFolder, setNewFolderName } from '../../context/folders/FoldersActions';
import { useAddBuildToFolder } from '../../context/folders/FoldersActions';
import { useFoldersContext } from '../../context/folders/FoldersContext';
import Builds from '../builds/Builds';
import { cloneDeep } from 'lodash';
import { useAuthContext } from '../../context/auth/AuthContext';
import Sort from '../sort/Sort';
import { useBuildContext } from '../../context/build/BuildContext';
import { useUpdateBuild } from '../../context/build/BuildActions';
import { toast } from 'react-toastify';
import { useGetFilteredBuilds } from '../../context/builds/BuildsActions';
import errorReport from '../../utilities/errorReport';

/**
 * Modal for adding a build to a folder
 * @returns
 */
function AddBuildToFolderModal() {
	const { dispatchFolders, selectedFolders, buildToAddToFolder, openedFolder, pinnedFolder } = useFoldersContext();
	const { loadedBuild } = useBuildContext();
	const { user } = useAuthContext();
	const { updateBuild } = useUpdateBuild();
	const { addBuildToFolder } = useAddBuildToFolder();
	const [filteredBuilds] = useGetFilteredBuilds([]);

	const handleSaveFolderChange = async () => {
		await addBuildToFolder(buildToAddToFolder);

		if (pinnedFolder !== loadedBuild?.pinnedFolder) {
			if (loadedBuild?.uid !== user.uid) {
				toast.error('Cant pin a folder to a build thats not yours!');
				errorReport('Cant pin a folder to a build thats not yours!', false, 'handleSaveFolderChange');
				return;
			}

			const buildToUpdate = cloneDeep(loadedBuild);
			buildToUpdate.pinnedFolder = pinnedFolder;

			await updateBuild(buildToUpdate);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<input type="checkbox" id="add-build-to-folder-modal" className="modal-toggle" />
			<div className="modal">
				<div className={`modal-box relative w-300 min-w-3/4 2k:!min-w-1/2 !max-w-max`}>
					<div className="flex flex-col w-full justify-center">
						<Button
							htmlFor="add-build-to-folder-modal"
							text="X"
							position="absolute right-2 top-2 z-50"
							style="btn-circle"
							onClick={() => {
								setFolderLocation(dispatchFolders, null);
								setBuildToAddToFolder(dispatchFolders, null, user);
								setSelectedFolder(dispatchFolders, null, selectedFolders, buildToAddToFolder);
								setOpenedFolder(dispatchFolders, null);
								setAddBuildToFolderModal(dispatchFolders, false);
								setMakingNewFolder(dispatchFolders, false);
								setNewFolderName(dispatchFolders, null);
							}}
						/>
						<PlanetHeader text="Save build to folder" />

						<Folders />

						<div className="flex flex-row gap-2 w-full place-content-between mb-5 2k:mb-8">
							<div className="flex flex-row gap-3 2k:gap-5">
								<Button
									tabIndex={0}
									id="add-build-to-folder-btn"
									htmlFor="add-build-to-folder-modal"
									text={`${pinnedFolder !== loadedBuild?.pinnedFolder ? 'Save Changes' : selectedFolders.length > 1 ? `Save to ${selectedFolders.length} Folders` : selectedFolders.length > 0 ? 'Save to Folder' : 'Save'}`}
									icon="save"
									color="btn-success"
									onClick={handleSaveFolderChange}
								/>
							</div>
							<Button
								htmlFor="add-build-to-folder-modal"
								text="Cancel"
								icon="cancel"
								color="btn-error"
								position="place-self-end"
								onClick={() => {
									setFolderLocation(dispatchFolders, null);
									setBuildToAddToFolder(dispatchFolders, null, user);
									setSelectedFolder(dispatchFolders, null, selectedFolders, buildToAddToFolder);
									setOpenedFolder(dispatchFolders, null);
									setAddBuildToFolderModal(dispatchFolders, false);
									setMakingNewFolder(dispatchFolders, false);
									setNewFolderName(dispatchFolders, null);
								}}
							/>
						</div>

						<div className="flex flex-row w-full justify-end mb-4">
							<Sort />
						</div>
						{openedFolder ? <Builds buildsToDisplay={filteredBuilds} /> : null}
					</div>
				</div>
			</div>
		</>
	);
}

export default AddBuildToFolderModal;
