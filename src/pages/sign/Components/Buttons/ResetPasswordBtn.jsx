import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setResetPassword } from '../../../../context/auth/AuthActions';

/**
 * Button for resetting a password
 * @returns
 */
function ResetPasswordBtn() {
	const { dispatchAuth } = useContext(AuthContext);

	return <Button onClick={() => setResetPassword(dispatchAuth, true)} text="Reset Password" color="btn-accent" icon="reset" />;
}

export default ResetPasswordBtn;
