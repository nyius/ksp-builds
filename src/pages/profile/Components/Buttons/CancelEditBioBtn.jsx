import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingBio } from '../../../../context/auth/AuthActions';

/**
 * Button for cancelling editing the users bio
 * @returns
 */
function CancelEditBioBtn() {
	const { dispatchAuth } = useContext(AuthContext);

	return <Button text="Cancel" color="btn-error" icon="cancel" onClick={() => setEditingBio(dispatchAuth, false)} size="w-fit" />;
}

export default CancelEditBioBtn;