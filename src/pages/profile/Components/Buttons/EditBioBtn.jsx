import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingProfile } from '../../../../context/auth/AuthActions';

/**
 * Button for editing the users bio
 * @returns
 */
function EditBioBtn() {
	const { dispatchAuth, user } = useContext(AuthContext);

	return <Button text="Edit Bio" icon="edit" color="bg-base-900" onClick={() => setEditingProfile(dispatchAuth, { bio: user.bio })} size="btn-sm 2k:btn-md w-fit" margin="mt-3 2k:mt-6 mb-4" />;
}

export default EditBioBtn;
