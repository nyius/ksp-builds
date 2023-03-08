import React, { useContext } from 'react';
import Button from '../buttons/Button';
import useBuild from '../../context/build/BuildActions';
import BuildContext from '../../context/build/BuildContext';

/**
 * Modal for when the user wants to cancel editing their build before saving
 * @returns
 */
function CancelBuildEditModal() {
	const { cancelBuilEdit } = useBuild();
	const { loadedBuild } = useContext(BuildContext);

	return (
		<>
			<input type="checkbox" id="cancel-build-edit" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative scrollbar">
					<h3 className="text-2xl 2k:text-4xl font-bold text-slate-100 text-center mb-6">Cancel Changes</h3>
					<h3 className="text-xl 2k:text-xl text-slate-100 text-center mb-6">Are you sure you want to cancel? Any changes will be lost</h3>

					<div className="flex flex-row gap-2 w-full items-center justify-center">
						<Button htmlFor="cancel-build-edit" text="No, Stay" color="btn-success" icon="done" />
						<Button htmlFor="cancel-build-edit" text="Yes, Cancel" color="btn-error" icon="cancel" onClick={() => cancelBuilEdit(loadedBuild)} />
					</div>
				</div>
			</div>
		</>
	);
}

export default CancelBuildEditModal;
