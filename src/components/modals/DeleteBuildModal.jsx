import React from 'react';
import useBuild from '../../context/build/BuildActions';
import Button from '../buttons/Button';

function DeleteBuildModal({ id, userID }) {
	const { deleteBuild } = useBuild();

	return (
		<>
			<input type="checkbox" id="delete-build-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<Button htmlFor="delete-build-modal" style="btn-circle" position="absolute right-2 top-2" text="X" />
					<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete Build</h3>
					<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this build?</h4>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-build-modal" color="btn-success" text="Cancel" icon="cancel" />
						<Button htmlFor="delete-build-modal" color="btn-error" onClick={() => deleteBuild(id, userID)} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteBuildModal;
