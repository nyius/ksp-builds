import React, { useState, useEffect } from 'react';
import useResetStates from '../../utilities/useResetStates';
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

/**
 * Sign up page
 * @returns
 */
function SignUp() {
	const [newUser, setNewUser] = useState({
		email: '',
		emailVerify: '',
		password: '',
	});
	const [accountExists, setAccountExists] = useState(false);
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

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Sign Up" pageLink="https://kspbuilds.com/sign-up" description="Sign up for free to KSP Builds! Create an account to upload your creations, save your favorites, and comment/chat with others" />

			<MiddleContainer>
				<PlanetHeader text="Sign Up" />
				<div className="flex flex-col sm:flex-row gap-5 2k:gap-10 items-center justify-center">
					<div className="w-full sm:w-1/2 self-center flex flex-col">
						<form className="w-full flex flex-col self-center" action="">
							{/* Emails */}
							<p className="text-xl 2k:text-3xl text-slate-400">Email</p>
							<TextInput onChange={handleFieldChange} type="email" id="email" placeholder="Enter email" required={true} margin=" mb-2" />

							<TextInput onChange={handleFieldChange} type="email" id="emailVerify" placeholder="Re-enter email" required={true} margin="mb-2" />
							{newUser.email && newUser.emailVerify ? (
								<>{checkMatchingEmail() ? <p className="text-xl 2k:text-2xl italic text-emerald-500">Emails match!</p> : <p className="text-xl 2k:text-2xl italic text-red-500">Emails must match</p>}</>
							) : null}

							{/* Password */}
							<p className="text-xl 2k:text-3xl text-slate-400 mt-6 2k:mt-10">Password</p>
							<TextInput onChange={handleFieldChange} type="password" id="password" placeholder="Enter password" required={true} margin="mb-2" />
							{newUser.password && newUser.password.length < 6 ? <p className="text-xl 2k:text-2xl italic text-red-500">Password must be more than 6 characters</p> : null}

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

						<p className="text-xl 2k:text-3xl mb-4">Or create an account with Google</p>
						<GoogleLoginBtn />
					</div>
					<img src={AstrobiffRide} alt="AStrobiff Riding Rocket" className="w-100 h-full" />
				</div>
			</MiddleContainer>
		</>
	);
}

export default SignUp;
