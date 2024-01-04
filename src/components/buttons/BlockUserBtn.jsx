import React, { useContext } from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import Button from './Button';
import { setUserToBlock } from '../../context/auth/AuthActions';

/**
 * Button to block a user
 * @returns
 */
function BlockUserBtn({ userToBlock }) {
	const { user, dispatchAuth } = useAuthContext();

	if (userToBlock && user && user?.username !== userToBlock?.username) {
		return <Button htmlFor="block-modal" color="btn-error" size="w-fit" icon="cancel" tooltip={user?.blockList?.includes(userToBlock.uid) ? 'Unblock' : 'Block'} onClick={() => setUserToBlock(dispatchAuth, userToBlock.uid)} />;
	}
}

export default BlockUserBtn;
