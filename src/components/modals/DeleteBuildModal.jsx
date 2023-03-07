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
					<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete Build</h3>
					<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this build?</h4>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<label htmlFor="delete-build-modal" className="btn btn-success 2k:btn-lg 2k:text-2xl">
							Cancel
						</label>
						<label onClick={() => deleteBuild(id, userID)} htmlFor="delete-build-modal" className="btn btn-error 2k:btn-lg 2k:text-2xl">
							Delete
						</label>
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteBuildModal;
