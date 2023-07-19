import React from 'react';
import { useDeleteBuild } from '../../context/build/BuildActions';
import Button from '../buttons/Button';
import { useBuildContext } from '../../context/build/BuildContext';
import PlanetHeader from '../header/PlanetHeader';

/**
 * Modal for deleting a build
 * @param {*} id
 * @param {*} userID
 * @returns
 */
function DeleteBuildModal({ id, userID }) {
	const { loadedBuild } = useBuildContext();
	const { deleteBuild } = useDeleteBuild();

	return (
		<>
			{loadedBuild ? (
				<>
					<input type="checkbox" id="delete-build-modal" className="modal-toggle" />
					<div className="modal">
						<div className="modal-box relative">
							<Button htmlFor="delete-build-modal" style="btn-circle" position="z-50 absolute right-2 top-2" text="X" />
							<PlanetHeader text="Delete Build"></PlanetHeader>
							<h4 className="text-xl 2k:text-3xl text-slate-100 text-center mb-10 2k:mb-16">Are you sure you want to delete this build?</h4>
							<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
								<Button htmlFor="delete-build-modal" color="btn-success" text="Cancel" icon="cancel" />
								<Button htmlFor="delete-build-modal" color="btn-error" onClick={() => deleteBuild(id, userID)} text="Delete" icon="delete" />
							</div>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}

export default DeleteBuildModal;
