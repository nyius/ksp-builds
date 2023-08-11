import React, { useState } from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import TextInput from '../input/TextInput';
import { toast } from 'react-toastify';
import resetPassword from '../../utilities/resetPassword';
import { useAuthContext } from '../../context/auth/AuthContext';
import { setResetPassword } from '../../context/auth/AuthActions';
import errorReport from '../../utilities/errorReport';

function ResetPassword() {
	const [email, setEmail] = useState('');
	const [emailSent, setEmailSent] = useState('');
	const { resetPasswordState, dispatchAuth } = useAuthContext();
	/**
	 * Handles a user starting the login process
	 * @returns
	 */
	const handleResetPassword = async () => {
		if (!email) {
			errorReport('No Email', false, 'handleResetPassword');
			toast.error('You forgot to enter a email');
			return;
		}

		const status = await resetPassword(email);
		setEmailSent(true);
		setResetPassword(dispatchAuth, false);
	};

	if (resetPasswordState) {
		return (
			<>
				{/* Login */}
				<input type="checkbox" checked={resetPasswordState} id="reset-password" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button htmlFor="reset-password" onClick={() => setResetPassword(dispatchAuth, false)} style="btn-circle" size="absolute right-2 top-2 z-50" text="X" />
						<PlanetHeader text="Reset Password" />

						{/* Email Login */}
						<form onSubmit={handleResetPassword} className="mb-4">
							<p className="text-xl 2k:text-3xl">Email</p>
							<TextInput onChange={e => setEmail(e.target.value)} id="username" size="w-full" margin="mt-2 mb-2 2k:mb-4" color="bg-base-200" required={true} type="email" />

							<Button htmlFor="login-modal" onClick={handleResetPassword} text="Send" icon="email" margin="mt-4 2k:mt-10 mb-5 2k:mb-10" />
						</form>
					</div>
				</div>
			</>
		);
	}
}

export default ResetPassword;
