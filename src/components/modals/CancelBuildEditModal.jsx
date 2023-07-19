import React from 'react';
import Button from '../buttons/Button';
import { setCancelBuilEdit } from '../../context/build/BuildActions';
import { useBuildContext } from '../../context/build/BuildContext';
import PlanetHeader from '../header/PlanetHeader';

/**
 * Modal for when the user wants to cancel editing their build before saving
 * @returns
 */
function CancelBuildEditModal() {
	const { dispatchBuild, loadedBuild } = useBuildContext();

	return (
		<>
			<input type="checkbox" id="cancel-build-edit" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative scrollbar">
					<PlanetHeader text="Cancel Changes"></PlanetHeader>
					<h3 className="text-xl 2k:text-xl text-slate-100 text-center mb-6">Are you sure you want to cancel? Any changes will be lost</h3>

					<div className="flex flex-row gap-2 w-full items-center justify-center">
						<Button htmlFor="cancel-build-edit" text="No, Stay" color="btn-success" icon="done" />
						<Button htmlFor="cancel-build-edit" text="Yes, Cancel" color="btn-error" icon="cancel" onClick={() => setCancelBuilEdit(dispatchBuild, loadedBuild)} />
					</div>
				</div>
			</div>
		</>
	);
}

export default CancelBuildEditModal;
