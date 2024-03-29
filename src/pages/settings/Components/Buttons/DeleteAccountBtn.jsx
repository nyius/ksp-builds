import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setAccountToDelete } from '../../../../context/auth/AuthActions';

function DeleteAccountBtn() {
	const { dispatchAuth, user } = useAuthContext();

	return <Button text="Delete Account" htmlFor="delete-account-modal" onClick={() => setAccountToDelete(dispatchAuth, user.uid)} size="w-fit" icon="delete" color="btn-error" />;
}

export default DeleteAccountBtn;
