import React from 'react';
import useBuild from '../../context/build/BuildActions';

function DeleteBuildModal({ id, userID }) {
	const { deleteBuild } = useBuild();

	return (
		<>
			<input type="checkbox" id="delete-build-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<label htmlFor="delete-build-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
						✕
					</label>
					<h3 className="text-lg font-bold text-center">Delete Build</h3>
					<h4 className="text-lg text-center mb-4">Are you sure you want to delete this build?</h4>
					<div className="flex flex-row items-center justify-center gap-4">
						<label htmlFor="delete-build-modal" className="btn btn-success">
							Cancel
						</label>
						<label onClick={() => deleteBuild(id, userID)} htmlFor="delete-build-modal" className="btn btn-error">
							Delete
						</label>
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteBuildModal;
