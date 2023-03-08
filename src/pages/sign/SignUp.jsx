import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AiFillCamera } from 'react-icons/ai';
import useAuth from '../../context/auth/AuthActions';
import { auth } from '../../firebase.config';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import TextInput from '../../components/input/TextInput';
import Button from '../../components/buttons/Button';
import Spinner1 from '../../components/spinners/Spinner1';
import newEmailAccount from '../../utilities/newEmailAccount';
import PlanetHeader from '../../components/header/PlanetHeader';

function SignUp() {
	const [newUser, setNewUser] = useState({
		email: '',
		emailVerify: '',
		password: '',
	});
	const { setNewSignup } = useAuth();

	/**
	 * Handles setting the newUser state to a changing field
	 * @param {*} e
	 */
	const handleFieldChange = e => {
		setNewUser(prevState => {
			return {
				...prevState,
				[e.target.id]: e.target.value,
			};
		});
	};

	/**
	 * Check if emals match
	 * @returns
	 */
	const checkMatchingEmail = () => {
		if (newUser.email && newUser.emailVerify) {
			if (newUser.email !== newUser.emailVerify) {
				return false;
			} else {
				return true;
			}
		}
	};

	const signUp = async () => {
		if (!newUser.email) {
			console.log('No email');
			toast.error('You forgot an email!');
			return;
		}
		if (!newUser.password) {
			console.log(`No password`);
			toast.error('You forget a password');
			return;
		}
		if (newUser.password.length < 6) {
			console.log(`Password too Short`);
			toast.error('Password must be more than 6 characters');
			return;
		}
		if (!checkMatchingEmail()) {
			console.log(`Emails don't match`);
			toast.error("Your emails don't match");
			return;
		}

		const signinStatus = await newEmailAccount(newUser);

		// if we have a new google user, set signUp to true so that we can display the modal to allow them create a username/profile picture
		if (signinStatus === 'newUser') {
			setNewSignup(true);
		}

		toast.success('Account created!');
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Sign Up" />
			<form className="w-full sm:w-1/2 flex flex-col self-center" action="">
				{/* Emails */}
				<p className="text-xl 2k:text-3xl text-slate-400">Email</p>
				<TextInput onChange={handleFieldChange} type="email" id="email" placeholder="Enter email" required={true} margin=" mb-2" />

				<TextInput onChange={handleFieldChange} type="email" id="emailVerify" placeholder="Re-enter email" required={true} margin="mb-2" />
				{newUser.email && newUser.emailVerify && <>{checkMatchingEmail() ? <p className="text-xl 2k:text-2xl italic text-emerald-500">Emails match!</p> : <p className="text-xl 2k:text-2xl italic text-red-500">Emails must match</p>}</>}

				{/* Password */}
				<p className="text-xl 2k:text-3xl text-slate-400 mt-6 2k:mt-10">Password</p>
				<TextInput onChange={handleFieldChange} type="password" id="password" placeholder="Enter password" required={true} margin="mb-2" />
				{newUser.password && newUser.password.length < 6 && <p className="text-xl 2k:text-2xl italic text-red-500">Password must be more than 6 characters</p>}

				<Button text="Submit" margin="mb-10 2k:mb-16 mt-10 2k:mt-16" icon="save" color="btn-primary" onClick={() => signUp()} />
			</form>
		</MiddleContainer>
	);
}

export default SignUp;
