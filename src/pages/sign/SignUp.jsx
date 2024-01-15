import React, { useEffect, useState } from 'react';
import useResetStates from '../../hooks/useResetStates';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import TextInput from '../../components/input/TextInput';
import PlanetHeader from '../../components/header/PlanetHeader';
import AstrobiffRide from '../../assets/astrobiff-ride.png';
import Helmet from '../../components/Helmet/Helmet';
import SignUpBtn from './Components/Buttons/SignUpBtn';
import LoginBtn from './Components/Buttons/LoginBtn';
import ResetPasswordBtn from './Components/Buttons/ResetPasswordBtn';
import GoogleLoginBtn from './Components/Buttons/GoogleLoginBtn';
import { checkMatchingEmails, validateEmail } from '../../context/auth/AuthUtils';

/**
 * Sign up page
 * @returns
 */
function SignUp() {
	const [newUser, setNewUser] = useState({
		email: '',
		emailVerify: '',
		password: '',
		passwordVerify: '',
	});
	const [accountExists, setAccountExists] = useState(false);
	const [emailError, setEmailError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);

	useResetStates();

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

	useEffect(() => {
		if (newUser.email !== newUser.emailVerify) {
			setEmailError(`Email doesn't match!`);
		} else {
			if (newUser.email !== '' && !validateEmail(newUser.email)) {
				setEmailError(`Not a valid email address!`);
			} else {
				setEmailError(null);
			}
		}
		if (newUser.password !== '' && newUser.password.length < 6) {
			setPasswordError('Password needs to be longer than 6 characters!');
		} else {
			if (newUser.password !== newUser.passwordVerify) {
				setPasswordError('Passwords need to match!');
			} else {
				setPasswordError(null);
			}
		}
	}, [newUser]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Sign Up" pageLink="https://kspbuilds.com/sign-up" description="Sign up for free to KSP Builds! Create an account to upload your creations, save your favorites, and comment/chat with others" />

			<MiddleContainer size="w-full lg:w-[60rem] xl:w-[70rem] 2k:w-[90rem] 4k:w-[100rem] place-self-center">
				<PlanetHeader text="Sign Up" />
				<div className="flex flex-col md:flex-row gap-5 2k:gap-10 items-center justify-center">
					<div className="w-full md:w-1/2 self-center flex flex-col">
						<form className="w-full flex flex-col self-center" action="">
							{/* Emails */}
							<p className="text-xl 2k:text-3xl text-slate-200">Email</p>
							<TextInput size="w-full" onChange={handleFieldChange} type="email" id="email" placeholder="Enter email" required={true} color="text-white" margin="mb-2" />

							<TextInput size="w-full" onChange={handleFieldChange} type="email" id="emailVerify" placeholder="Re-enter email" required={true} color="text-white" margin="mb-2" />
							{newUser.email && newUser.emailVerify && !emailError ? <>{checkMatchingEmails(newUser.email, newUser.emailVerify) ? <p className="text-xl 2k:text-2xl italic text-emerald-500">Emails match!</p> : null}</> : null}
							{emailError ? <p className="text-xl 2k:text-2xl italic text-red-500">{emailError}</p> : null}

							{/* Password */}
							<p className="text-xl 2k:text-3xl text-slate-200 mt-6 2k:mt-10">Password</p>
							<TextInput size="w-full" onChange={handleFieldChange} type="password" id="password" placeholder="Enter password" required={true} color="text-white" margin="mb-2" />
							<TextInput size="w-full" onChange={handleFieldChange} type="password" id="passwordVerify" placeholder="Confirm password" required={true} color="text-white" margin="mb-2" />
							{passwordError ? <p className="text-xl 2k:text-2xl italic text-red-500">{passwordError}</p> : null}

							{accountExists ? (
								<div className="flex flex-col flex-wrap items-center gap-3 mt-4 2k:mt-8">
									<p className="text-xl 2k:text-2xl text-red-300">Account already exists! Try signing in, or reset your password</p>
									<div className="flex flex-row gap-4 2k:gap-6">
										<LoginBtn />
										<ResetPasswordBtn />
									</div>
								</div>
							) : null}

							<SignUpBtn newUser={newUser} setAccountExists={setAccountExists} />
						</form>

						<p className="text-xl 2k:text-3xl mb-4 text-slate-200">Or create an account with Google</p>
						<GoogleLoginBtn />
					</div>
					<img src={AstrobiffRide} alt="AStrobiff Riding Rocket" className="w-100 h-full" />
				</div>
			</MiddleContainer>
		</>
	);
}

export default SignUp;
