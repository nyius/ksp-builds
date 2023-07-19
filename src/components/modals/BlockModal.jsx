import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import { setUserToBlock, useBlockUser } from '../../context/auth/AuthActions';

/**
 * Modal for blocking a user
 * @returns
 */
function BlockModal() {
	const { dispatchAuth, user, userToBlock } = useAuthContext();
	const { blockUser } = useBlockUser();

	/**
	 * Handles blocking a user
	 */
	const handleBlockUser = async () => {
		await blockUser();
	};

	/**
	 * handles closing the modal and clearing the id of the user to block
	 */
	const handleCloseModal = () => {
		setUserToBlock(dispatchAuth, null);
	};

	//---------------------------------------------------------------------------------------------------//
	if (userToBlock) {
		return (
			<>
				<input type="checkbox" checked={userToBlock} id="block-modal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<div className="flex flex-col w-full justify-center">
							<Button onClick={handleCloseModal} htmlFor="block-modal" text="X" position="absolute right-2 top-2 z-50" style="btn-circle" />
							<PlanetHeader text={user?.blockList?.includes(userToBlock) ? 'Unblock' : 'Block'} />
							{user?.blockList?.includes(userToBlock) ? (
								<p className="text-xl 2k:text-2xl italic text-slate-200 mb-2 2k:mb-4">Are you sure you want to unblock this user? They'll be able to message you again and comment on your creations.</p>
							) : (
								<p className="text-xl 2k:text-2xl italic text-slate-200 mb-2 2k:mb-4">Are you sure you want to block this user? They'll no longer be able to message you or comment on any of your creations.</p>
							)}

							<div className="flex flex-wrap gap-4 2k:gap-8 justify-center align-center my-2 2k:my-4 w-full">
								<Button htmlFor="block-modal" text={user?.blockList?.includes(userToBlock) ? 'Unblock' : 'Block'} icon="cancel" color="btn-error" onClick={handleBlockUser} />
								<Button text="Cancel" color="btn-success" icon="right" htmlFor="block-modal" onClick={handleCloseModal} />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default BlockModal;
