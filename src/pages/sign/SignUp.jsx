import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../../context/auth/AuthActions';
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import TextInput from '../../components/input/TextInput';
import Button from '../../components/buttons/Button';
import PlanetHeader from '../../components/header/PlanetHeader';
import AstrobiffRide from '../../assets/astrobiff-ride.png';

function SignUp() {
	const [newUser, setNewUser] = useState({
		email: '',
		emailVerify: '',
		password: '',
	});
	const [accountExists, setAccountExists] = useState(false);
	const { setResetPassword, newEmailAccount } = useAuth();

	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();
	}, []);
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

		if (signinStatus.message === 'exists') {
			setAccountExists(true);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Sign Up" />
			<div className="flex flex-col sm:flex-row gap-5 2k:gap-10 items-center justify-center">
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

					{accountExists && (
						<div className="flex flex-col flex-wrap items-center gap-3 mt-4 2k:mt-8">
							<p className="text-xl 2k:text-2xl text-red-300">Account already exists! Try signing in, or reset your password</p>
							<div className="flex flex-row gap-4 2k:gap-6">
								<Button htmlFor="login-modal" text="Login" color="btn-primary" icon="login" />
								<Button onClick={() => setResetPassword(true)} text="Reset Password" color="btn-accent" icon="reset" />
							</div>
						</div>
					)}
					<Button text="Submit" margin="mb-10 2k:mb-16 mt-10 2k:mt-16" icon="save" color="btn-primary" onClick={() => signUp()} />
				</form>
				<img src={AstrobiffRide} alt="AStrobiff Riding Rocket" className="w-100 h-full" />
			</div>
		</MiddleContainer>
	);
}

export default SignUp;
