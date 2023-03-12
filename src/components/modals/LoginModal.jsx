import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import TextInput from '../input/TextInput';
import emailLogin from '../../utilities/emailLogin';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';

function LoginModal() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [wrongLogin, setWrongLogin] = useState('');
	const { user, authLoading, resetPasswordState } = useContext(AuthContext);
	const { setResetPassword, loginWithGoogle } = useAuth();

	/**
	 * Handles a user starting the login process
	 * @returns
	 */
	const handleEmailLogin = async () => {
		if (!email) {
			console.log(`No email`);
			toast.error('You forgot to enter a email');
			return;
		}
		if (!password) {
			console.log(`No password`);
			toast.error('You forgot to enter a password');
			return;
		}

		const status = await emailLogin(email, password);
		setWrongLogin(status);
	};

	if (!authLoading && !user?.username && !resetPasswordState) {
		return (
			<>
				{/* Login */}
				<input type="checkbox" id="login-modal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button htmlFor="login-modal" style="btn-circle" size="absolute right-2 top-2 z-50" text="X" />
						<PlanetHeader text="Login" />

						{/* Email Login */}
						<form onSubmit={handleEmailLogin} className="mb-4">
							<p className="text-xl 2k:text-3xl">Email</p>
							<TextInput onChange={e => setEmail(e.target.value)} id="username" size="w-full" margin="mt-2 mb-2 2k:mb-4" color="bg-base-200" required={true} type="email" />
							{wrongLogin && wrongLogin.includes('invalid-email') && <p className="text-xl 2k-text-2xl text-red-300 italic">Invalid Email</p>}
							{wrongLogin && wrongLogin.includes('user-not-found') && <p className="text-xl 2k-text-2xl text-red-300 italic">User not found</p>}

							<p className="text-xl 2k:text-3xl mt-5 2k:mt-10">Password</p>
							<TextInput onChange={e => setPassword(e.target.value)} id="password" size="w-full" margin="mb-4 mt-2" color="bg-base-200" required={true} type="password" />
							{wrongLogin && wrongLogin.includes('password') && <p className="text-xl 2k-text-2xl text-red-300 italic">Invalid Password</p>}
							<div className="flex flex-row gap-4 flex-wrap">
								<Button onClick={handleEmailLogin} text="Login" icon="login" margin="mt-4 2k:mt-10 mb-5 2k:mb-10" />
								<Button onClick={() => setResetPassword(true)} text="Reset Password" icon="reset" margin="mt-4 2k:mt-10 mb-5 2k:mb-10" />
							</div>
						</form>

						<label htmlFor="login-modal" className="py-4 text-xl 2k:text-3xl" onClick={() => navigate('/sign-up')}>
							Dont have an account? <span className="link link-accent">Create one now!</span>
						</label>
						<div className="divider"></div>

						{/* Google Login */}
						<div className="flex justify-center align-center mt-2 w-full">
							<Button htmlFor="login-modal" icon="google" text="Login with Google" onClick={loginWithGoogle} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default LoginModal;
