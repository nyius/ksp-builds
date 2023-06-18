import React, { useContext, useEffect, useState } from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import Folders from '../folders/Folders';
import { setBuildToAddToFolder, setSelectedFolder, setOpenedFolder, setAddBuildToFolderModal, setFolderLocation, setMakingNewFolder, setNewFolderName } from '../../context/folders/FoldersActions';
import { useAddBuildToFolder } from '../../context/folders/FoldersActions';
import FoldersContext from '../../context/folders/FoldersContext';
import Builds from '../builds/Builds';
import { cloneDeep } from 'lodash';
import BuildsContext from '../../context/builds/BuildsContext';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
import AuthContext from '../../context/auth/AuthContext';
import Sort from '../sort/Sort';

/**
 * Modal for adding a build to a folder
 * @returns
 */
function AddBuildToFolderModal() {
	const { dispatchFolders, selectedFolders, buildToAddToFolder, openedFolder } = useContext(FoldersContext);
	const { user } = useContext(AuthContext);
	const { addBuildToFolder } = useAddBuildToFolder();
	const { filterBuilds } = useFilters();
	const { fetchedBuilds } = useContext(BuildsContext);
	const { sortBy } = useContext(FiltersContext);
	const [sortedBuilds, setSortedBuilds] = useState([]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

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
							<Button
								tabIndex={0}
								id="add-build-to-folder-btn"
								htmlFor="add-build-to-folder-modal"
								text={`${`${selectedFolders.length > 1 ? `Save to ${selectedFolders.length} Folders` : `${selectedFolders.length > 0 ? 'Save to Folder' : 'Save'}`}`}`}
								icon="save"
								color="btn-success"
								onClick={() => addBuildToFolder(buildToAddToFolder)}
							/>
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
						{openedFolder ? <Builds buildsToDisplay={sortedBuilds} /> : null}
					</div>
				</div>
			</div>
		</>
	);
}

export default AddBuildToFolderModal;
