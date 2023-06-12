import React from 'react';
import DeleteAccountBtn from './Buttons/DeleteAccountBtn';

/**
 * Button for deleting an account
 * @returns
 */
function DeleteAccount() {
	return (
		<>
			<p className="text-xl 2k:text-2xl text-slate-400 italic">Delete Account</p>
			<DeleteAccountBtn />
		</>
	);
}

export default DeleteAccount;
