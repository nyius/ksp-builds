import React from 'react';
import Button from '../../../../components/buttons/Button';
import useAuth from '../../../../context/auth/AuthActions';

/**
 * Button for logging in with google
 * @returns
 */
function GoogleLoginBtn() {
	const { loginWithGoogle } = useAuth();

	return <Button color="btn-primary" margin="mb-10" icon="google" text="Create with Google" size="w-full" onClick={loginWithGoogle} />;
}

export default GoogleLoginBtn;
