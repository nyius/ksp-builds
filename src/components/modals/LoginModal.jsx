import React from 'react';
import GoogleSignIn from '../buttons/google/GoogleSignIn';

function LoginModal() {
	return (
		<>
			{/* Login */}
			<input type="checkbox" id="login-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<label htmlFor="login-modal" className="btn btn-sm 2k:btn-lg 2k:text-2xl btn-circle absolute right-2 top-2">
						✕
					</label>
					<h3 className="text-xl 2k:text-4xl font-bold text-center">Login</h3>

					{/* Email Login */}
					<form className="mb-4">
						<label htmlFor="usernam" className="text-xl 2k:text-3xl">
							Username
						</label>
						<input id="username" className="input 2k:input-lg 2k:text-2xl bg-base-200 mt-2 mb-4 w-full" type="text" />

						<label htmlFor="passwor" className="text-xl 2k:text-3xl">
							Password
						</label>
						<input id="password" className="input 2k:input-lg 2k:text-2xl bg-base-200 mt-2 w-full" type="password" />
						<button className="btn 2k:btn-lg 2k:text-2xl btn-dark mt-2">Login</button>
					</form>

					<p className="py-4 text-xl 2k:text-3xl">
						Dont have an account? <span className="link link-accent">Create one now!</span>
					</p>
					<div className="divider"></div>

					{/* Google Login */}
					<div className="flex justify-center align-center mt-2 w-full">
						<label htmlFor="login-modal">
							<GoogleSignIn />
						</label>
					</div>
				</div>
			</div>
		</>
	);
}

export default LoginModal;
