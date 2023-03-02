import React from 'react';
import GoogleSignIn from '../buttons/google/GoogleSignIn';

function LoginModal() {
	return (
		<>
			{/* Login */}
			<input type="checkbox" id="login-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<label htmlFor="login-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
						✕
					</label>
					<h3 className="text-lg font-bold text-center">Login</h3>

					{/* Email Login */}
					<form className="mb-4">
						<label htmlFor="username">Username</label>
						<input id="username" className="input bg-base-200 mt-2 mb-4 w-full" type="text" />

						<label htmlFor="password">Password</label>
						<input id="password" className="input bg-base-200 mt-2 w-full" type="password" />
						<button className="btn btn-dark mt-2">Login</button>
					</form>

					<p className="py-4">
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
