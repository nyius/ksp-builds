import React, { useState, useContext } from 'react';
import googleLogin from '../../../utilities/googleLogin';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../../context/auth/AuthActions';
import { toast } from 'react-toastify';

function GoogleSignIn() {
	const { setNewGoogleSignup } = useAuth();

	/**
	 * Handles signing in
	 */
	const signIn = async () => {
		try {
			const signinStatus = await googleLogin();

			// if we have a new google user, set signUp to true so that we can display the modal to allow them create a username/profile picture
			if (signinStatus === 'newUser') {
				setNewGoogleSignup(true);
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong. Please try again');
		}
	};

	return (
		<div className="btn 2k:btn-lg 2k:text-2xl" onClick={() => signIn()}>
			<FcGoogle />
			<span className="ml-2">Login with Google </span>
		</div>
	);
}

export default GoogleSignIn;
