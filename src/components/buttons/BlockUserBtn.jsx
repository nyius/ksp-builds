import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Button from './Button';
import { setUserToBlock } from '../../context/auth/AuthActions';

/**
 * Button to block a user
 * @returns
 */
function BlockUserBtn({ userToBlock }) {
	const { user, dispatchAuth } = useContext(AuthContext);

	if (userToBlock && user && user?.username !== userToBlock?.username) {
		return (
			<div className="tooltip" data-tip="Block">
				<Button htmlFor="block-modal" color="btn-error" size="w-full" icon="cancel" text={user?.blockList?.includes(userToBlock.uid) ? 'Unblock' : 'Block'} onClick={() => setUserToBlock(dispatchAuth, userToBlock.uid)} />
			</div>
		);
	}
}

export default BlockUserBtn;
