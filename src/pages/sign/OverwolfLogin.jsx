import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/buttons/Button';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, EmailAuthProvider, getIdToken, getIdTokenResult } from 'firebase/auth';
import TextInput from '../../components/input/TextInput';
import { auth, googleProvider } from '../../firebase.config';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../context/auth/AuthContext';
import { setResetPassword } from '../../context/auth/AuthActions';
import Helmet from '../../components/Helmet/Helmet';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import errorReport from '../../utilities/errorReport';
import OverwolfLogo from '../../assets/Overwolf_logo_PNG_horizontal.png';
import KSPBuildsLogo from '../../assets/logo_light_full.png';
import { FiDownload } from 'react-icons/fi';

function OverwolfLogin() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [wrongLogin, setWrongLogin] = useState('');
	const { isAuthenticated, authLoading, resetPasswordState, dispatchAuth } = useAuthContext();

	// Check if the user is already logged in
	useEffect(() => {
		const getToken = async () => {
			if (isAuthenticated && !authLoading) {
				const user = auth.currentUser;
				const token = await getIdToken(user);
				const tr = await getIdTokenResult(user);
			}
		};

		getToken();
	}, [isAuthenticated, authLoading]);

	/**
	 * Handles a user starting the login process
	 * @returns
	 */
	const handleEmailLogin = async () => {
		return;
		try {
			if (!email) {
				errorReport('No Email', false, 'handleEmailLogin');
				toast.error('You forgot to enter a email');
				return;
			}
			if (!password) {
				errorReport('No password', false, 'handleEmailLogin');
				toast.error('You forgot to enter a password');
				return;
			}

			const credential = await signInWithEmailAndPassword(auth, email, password);
			console.log(credential);
			// setWrongLogin(status);
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	const handleGoogleLogin = async () => {
		return;
		try {
			await signInWithPopup(auth, googleProvider).then(res => {
				const credential = GoogleAuthProvider.credentialFromResult(res);

				// After we get the logged in users credentials, send it back to overwolf
				window.location.replace(`overwolf-extension://cgjfohcpphloncjildahljfddedneemimdadmfmk/windows/login/login.html?at=${credential.accessToken}&it=${credential.idToken}`);
			});
		} catch (error) {
			console.log(error);
		}
	};

	// if (!authLoading && !isAuthenticated && !resetPasswordState) {
	return (
		<>
			<Helmet title="Login" pageLink="https://kspbuilds.com/login" description="Login to KSP Builds" />
			<MiddleContainer size="w-full lg:w-[70rem] 2k:w-300 place-self-center">
				{/* Login */}
				<PlanetHeader text="Overwolf Login" />

				<div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full text-4xl text-secondary pixel-font rounded-lg bg-base-900 p-4 mb-2">
					<img src={KSPBuildsLogo} alt="KSP Builds Logo" className="w-99" />
					X
					<img src={OverwolfLogo} alt="Overwolf Logo" className="w-99" />
				</div>

				<div className="flex flex-col md:flex-row gap-4 w-full mb-10 font-bold">
					<div className="flex flex-col gap-3 w-full md:w-1/2 bg-base-800 rounded-xl border-b-2 border-solid border-primary py-8 px-4 items-center justify-center">
						<div className="text-5xl text-slate-200 mb-3">
							<FiDownload />
						</div>
						<div className="text-2xl 2k:text-3xl text-slate-300 text-center mb-1">Don't have Overwolf yet?</div>
						<div className="text-2xl 2k:text-3xl text-slate-300 text-center mb-1">
							Get it{' '}
							<Link to="https://www.overwolf.com/appstore/" target="_blank" rel="noopener noreferrer" className="text-success underline">
								here.
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-3 w-full md:w-1/2 bg-base-800 rounded-xl border-b-2 border-solid border-primary py-8 px-4 items-center justify-center">
						<div className="text-5xl text-slate-200 mb-3">
							<FiDownload />
						</div>
						<div className="text-2xl 2k:text-3xl text-slate-300 text-center mb-1">
							Download the official KSP Builds x Overwolf App{' '}
							<Link to="https://www.overwolf.com/appstore/" target="_blank" rel="noopener noreferrer" className="text-success underline">
								here.
							</Link>
						</div>
					</div>
				</div>

				<div className="text-2xl 2k:text-3xl text-slate-300 italic text-center mb-3 px-2 py-6 bg-base-800 rounded-lg">You'll be redirected back to Overwolf after successfully signing in.</div>
				{/* Google Login */}
				<div className="flex justify-center align-center my-4 w-full">
					<Button icon="google" color="btn-primary" size="w-full btn-lg" text="Login with Google" onClick={handleGoogleLogin} />
				</div>

				<div className="divider"></div>

				{/* New Account */}
				<label className="py-4 text-xl 2k:text-3xl text-center" onClick={() => navigate('/sign-up')}>
					Dont have an account? <span className="link link-accent">Create one now!</span>
				</label>
			</MiddleContainer>
		</>
	);
	// }
}

export default OverwolfLogin;
