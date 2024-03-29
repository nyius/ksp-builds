import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import CheckCredentials from '../../../../components/credentials/CheckCredentials';
import Button from '../../../../components/buttons/Button';
import { setAccountToDelete } from '../../../../context/auth/AuthActions';

/**
 * Button for deleting an account (admin)
 * @returns
 */
function DeleteAccountBtn() {
	const { dispatchAuth } = useAuthContext();
	const usersId = useParams().id;

	return (
		<CheckCredentials type="admin">
			<Button htmlFor="delete-account-modal" text="Delete Account (admin)" onClick={() => setAccountToDelete(dispatchAuth, usersId)} />
		</CheckCredentials>
	);
}

export default DeleteAccountBtn;
