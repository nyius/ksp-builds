import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useDeleteBuild } from '../../context/build/BuildActions';

function DeleteBuildAdmin({ style, id, userID }) {
	const { user, authLoading } = useAuthContext();
	const { deleteBuild } = useDeleteBuild();

	//---------------------------------------------------------------------------------------------------//
	if (!authLoading) {
		if (user?.siteAdmin) {
			if (style === 'circle') {
				return (
					<div className="tooltip" data-tip="Delete Build">
						<button onClick={() => deleteBuild(id, userID)} className="btn btn-circle btn-error btn-sm hover:bg-red-500 right-0 top-0 absolute z-50">
							X
						</button>
					</div>
				);
			} else {
				return <button className="btn btn-error">Delete</button>;
			}
		}
	}
}

export default DeleteBuildAdmin;
