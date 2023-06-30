import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingBio } from '../../../../context/auth/AuthActions';

/**
 * Button for editing the users bio
 * @returns
 */
function EditBioBtn() {
	const { dispatchAuth, user } = useContext(AuthContext);

	return <Button tooltip="Edit Bio" icon="edit" color="btn-ghost text-white" onClick={() => setEditingBio(dispatchAuth, { bio: user.bio })} size="btn-sm 2k:btn-md" position="!pl-0 !pr-0" />;
}

export default EditBioBtn;
