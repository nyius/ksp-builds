import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignIn from '../buttons/google/GoogleSignIn';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import TextInput from '../input/TextInput';
import emailLogin from '../../utilities/emailLogin';
import { toast } from 'react-toastify';

function LoginModal() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	/**
	 * Handles a user starting the login process
	 * @returns
	 */
	const handleEmailLogin = async () => {
		if (!username) {
			console.log(`No username`);
			toast.error('You forgot to enter a username');
			return;
		}
		if (!password) {
			console.log(`No password`);
			toast.error('You forgot to enter a password');
			return;
		}

		await emailLogin(username, password);
	};

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
						<label htmlFor="usernam" className="text-xl 2k:text-3xl">
							Username
						</label>
						<TextInput onChange={e => setUsername(e.target.value)} id="username" size="w-full" margin="mb-4 mt-2" color="bg-base-200" required={true} type="email" />

						<label htmlFor="passwor" className="text-xl 2k:text-3xl">
							Password
						</label>
						<TextInput onChange={e => setPassword(e.target.value)} id="password" size="w-full" margin="mb-4 mt-2" color="bg-base-200" required={true} type="password" />
						<Button onClick={handleEmailLogin} text="Login" icon="login" margin="mt-4 mb-5" />
					</form>

					<label htmlFor="login-modal" className="py-4 text-xl 2k:text-3xl" onClick={() => navigate('/sign-up')}>
						Dont have an account? <span className="link link-accent">Create one now!</span>
					</label>
					<div className="divider"></div>

					{/* Google Login */}
					<div className="flex justify-center align-center mt-2 w-full">
						<GoogleSignIn />
					</div>
				</div>
			</div>
		</>
	);
}

export default LoginModal;
