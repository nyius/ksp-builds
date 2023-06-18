import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import { toast } from 'react-toastify';
import { auth } from '../../../firebase.config';
import AuthContext from '../../../context/auth/AuthContext';

function SignOutBtn() {
	const { dispatchAuth } = useContext(AuthContext);

	/**
	 * Function to handle signing out
	 */
	const signOut = () => {
		toast.success('Logged Out');
		auth.signOut();
		dispatchAuth({
			action: 'LOGOUT',
		});
	};

	return <Button color="btn-ghost" size="w-full" css="border-2 border-solid border-slate-500 space-between" icon="logout" text="Logout" onClick={() => signOut()} />;
}

export default SignOutBtn;
