import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import Hangars from '../folders/Hangars';
import { setBuildToAddToHangar, setSelectedHangar, setOpenedHangar, setAddBuildToHangarModal, setHangarLocation, setMakingNewHangar, setNewHangarName } from '../../context/hangars/HangarActions';
import { useAddBuildToHangar } from '../../context/hangars/HangarActions';
import { useHangarContext } from '../../context/hangars/HangarContext';
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
 * Modal for adding a build to a hangar
 * @returns
 */
function AddBuildToHangarModal() {
	const { dispatchHangars, selectedHangars, buildToAddToHangar, openedHangar, pinnedHangar } = useHangarContext();
	const { loadedBuild } = useBuildContext();
	const { user } = useAuthContext();
	const { updateBuild } = useUpdateBuild();
	const { addBuildToHangar } = useAddBuildToHangar();
	const [filteredBuilds] = useGetFilteredBuilds([]);

	const handleSaveHangarChange = async () => {
		await addBuildToHangar(buildToAddToHangar);

		if (pinnedHangar !== loadedBuild?.pinnedHangar) {
			if (loadedBuild?.uid !== user.uid) {
				toast.error('Cant pin a hangar to a build thats not yours!');
				errorReport('Cant pin a hangar to a build thats not yours!', false, 'handleSaveHangarChange');
				return;
			}

			const buildToUpdate = cloneDeep(loadedBuild);
			buildToUpdate.pinnedHangar = pinnedHangar;

			await updateBuild(buildToUpdate);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<input type="checkbox" id="add-build-to-hangar-modal" className="modal-toggle" />
			<div className="modal">
				<div className={`modal-box relative w-300 min-w-3/4 2k:!min-w-1/2 !max-w-max`}>
					<div className="flex flex-col w-full justify-center">
						<Button
							htmlFor="add-build-to-hangar-modal"
							text="X"
							position="absolute right-2 top-2 z-50"
							style="btn-circle"
							onClick={() => {
								setHangarLocation(dispatchHangars, null);
								setBuildToAddToHangar(dispatchHangars, null, user);
								setSelectedHangar(dispatchHangars, null, selectedHangars, buildToAddToHangar);
								setOpenedHangar(dispatchHangars, null);
								setAddBuildToHangarModal(dispatchHangars, false);
								setMakingNewHangar(dispatchHangars, false);
								setNewHangarName(dispatchHangars, null);
							}}
						/>
						<PlanetHeader text="Save build to hangar" />

						<Hangars />

						<div className="flex flex-row gap-2 w-full place-content-between mb-5 2k:mb-8">
							<div className="flex flex-row gap-3 2k:gap-5">
								<Button
									tabIndex={0}
									id="add-build-to-hangar-btn"
									htmlFor="add-build-to-hangar-modal"
									text={`${pinnedHangar !== loadedBuild?.pinnedHangar ? 'Save Changes' : selectedHangars.length > 1 ? `Save to ${selectedHangars.length} Hangars` : selectedHangars.length > 0 ? 'Save to hangar' : 'Save'}`}
									icon="save"
									color="btn-success"
									onClick={handleSaveHangarChange}
								/>
							</div>
							<Button
								htmlFor="add-build-to-hangar-modal"
								text="Cancel"
								icon="cancel"
								color="btn-error"
								position="place-self-end"
								onClick={() => {
									setHangarLocation(dispatchHangars, null);
									setBuildToAddToHangar(dispatchHangars, null, user);
									setSelectedHangar(dispatchHangars, null, selectedHangars, buildToAddToHangar);
									setOpenedHangar(dispatchHangars, null);
									setAddBuildToHangarModal(dispatchHangars, false);
									setMakingNewHangar(dispatchHangars, false);
									setNewHangarName(dispatchHangars, null);
								}}
							/>
						</div>

						<div className="flex flex-row w-full justify-end mb-4">
							<Sort />
						</div>
						{openedHangar ? <Builds buildsToDisplay={filteredBuilds} /> : null}
					</div>
				</div>
			</div>
		</>
	);
}

export default AddBuildToHangarModal;
