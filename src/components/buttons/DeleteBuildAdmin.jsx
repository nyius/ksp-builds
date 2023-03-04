import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import useBuild from '../../context/build/BuildActions';

function DeleteBuildAdmin({ style, id }) {
	const { user, authLoading } = useContext(AuthContext);

	const { deleteBuild } = useBuild();

	//---------------------------------------------------------------------------------------------------//
	if (!authLoading) {
		if (user?.siteAdmin) {
			if (style === 'circle') {
				return (
					<div className="tooltip tooltip-right" data-tip="Delete Build">
						<button onClick={() => deleteBuild(id)} className="btn btn-circle btn-primary right-0 top-0 absolute z-50">
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
