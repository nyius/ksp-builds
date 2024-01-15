import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingBio } from '../../../../context/auth/AuthActions';

/**
 * Button for editing the users bio
 * @returns
 */
function EditBioBtn() {
	const { dispatchAuth, user } = useAuthContext();

	return <Button tooltip="Edit Bio" icon="edit" color="btn-ghost text-white" onClick={() => setEditingBio(dispatchAuth, { bio: user.bio })} size="btn-sm 2k:btn-md w-fit" />;
}

export default EditBioBtn;
