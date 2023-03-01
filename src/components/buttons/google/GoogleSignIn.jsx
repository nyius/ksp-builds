import React, { useState } from 'react';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import googleLogin from '../../../utilities/googleLogin';
import { auth } from '../../../firebase.config';

function GoogleSignIn() {
	const [isNewUser, setIsNewUser] = useState(false);

	/**
	 * Handles signing in
	 */
	const signIn = async () => {
		try {
			const signinStatus = await googleLogin();

			if (signinStatus === 'success') {
				console.log('Logged in!');
			} else if (signinStatus === 'newUser') {
				setIsNewUser(true);
			} else {
				//
			}
		} catch (error) {
			console.log(error);
		}
	};

	return <div onClick={() => signIn()}>GoogleSignIn</div>;
}

export default GoogleSignIn;
