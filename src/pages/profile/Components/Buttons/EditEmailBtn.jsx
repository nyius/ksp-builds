import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingEmail } from '../../../../context/auth/AuthActions';

/**
 * Button for editing the users bio
 * @returns
 */
function EditEmailBtn() {
	const { dispatchAuth, user } = useAuthContext();

	return <Button tooltip="Edit Email" icon="edit" color="btn-ghost" onClick={() => setEditingEmail(dispatchAuth, user.email)} />;
}

export default EditEmailBtn;
