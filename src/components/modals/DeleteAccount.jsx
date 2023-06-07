import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import AuthContext from '../../context/auth/AuthContext';
import { deleteUserAccount } from '../../context/auth/AuthUtils';

function DeleteAccount() {
	const navigate = useNavigate();
	const { authLoading, user, accountToDelete } = useContext(AuthContext);

	/**
	 * Handles a user starting the login process
	 * @returns
	 */
	const handleDeleteUser = async () => {
		await deleteUserAccount(accountToDelete, user.uid);
		navigate('/');
	};

	if (!authLoading && user?.username) {
		return (
			<>
				{/* Delete */}
				<input type="checkbox" id="delete-account-modal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button htmlFor="delete-account-modal" style="btn-circle" size="absolute right-2 top-2 z-50" text="X" />
						<PlanetHeader text="Delete Account" />

						<div className="flex flex-col flex-wrap gap-4 2k:gap-8 justify-center items-center mt-2 mb-16 w-full">
							<p className="text-2xl 2k:text-4xl font-bold">Are you sure?</p>
							<p className="text-xl 2k:text-2xl">This can't be undone.</p>
						</div>
						<div className="flex flex-wrap gap-4 2k:gap-8 justify-center align-center mt-2 w-full">
							<Button text="Cancel" color="btn-success" htmlFor="delete-account-modal" />
							<Button text="Delete" color="btn-error" onClick={handleDeleteUser} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default DeleteAccount;
