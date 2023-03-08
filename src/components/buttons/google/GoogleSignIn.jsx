import React, { useState, useContext } from 'react';
import googleLogin from '../../../utilities/googleLogin';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../../context/auth/AuthActions';
import { toast } from 'react-toastify';
import Button from '../Button';

function GoogleSignIn() {
	const { setNewSignup } = useAuth();

	/**
	 * Handles signing in
	 */
	const signIn = async () => {
		try {
			const signinStatus = await googleLogin();

			// if we have a new google user, set signUp to true so that we can display the modal to allow them create a username/profile picture
			if (signinStatus === 'newUser') {
				setNewSignup(true);
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong. Please try again');
		}
	};

	return <Button htmlFor="login-modal" icon="google" text="Login with Google" onClick={() => signIn()} />;
}

export default GoogleSignIn;
