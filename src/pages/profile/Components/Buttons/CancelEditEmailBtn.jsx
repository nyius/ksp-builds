import React from 'react';
import  { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingEmail } from '../../../../context/auth/AuthActions';

/**
 * Button for cancelling editing the users bio
 * @returns
 */
function CancelEditEmailBtn() {
	const { dispatchAuth } = useAuthContext();

	return <Button text="Cancel" color="btn-error" icon="cancel" onClick={() => setEditingEmail(dispatchAuth, false)} size="w-fit" />;
}

export default CancelEditEmailBtn;
