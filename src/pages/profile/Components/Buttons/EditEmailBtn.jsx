import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingEmail } from '../../../../context/auth/AuthActions';

/**
 * Button for editing the users bio
 * @returns
 */
function EditEmailBtn() {
	const { dispatchAuth, user } = useContext(AuthContext);

	return <Button tooltip="Edit Email" icon="edit" color="btn-ghost" onClick={() => setEditingEmail(dispatchAuth, user.email)} />;
}

export default EditEmailBtn;
