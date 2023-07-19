import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingBio } from '../../../../context/auth/AuthActions';

/**
 * Button for cancelling editing the users bio
 * @returns
 */
function CancelEditBioBtn() {
	const { dispatchAuth } = useAuthContext();

	return <Button text="Cancel" color="btn-error" icon="cancel" onClick={() => setEditingBio(dispatchAuth, false)} size="w-fit" />;
}

export default CancelEditBioBtn;
