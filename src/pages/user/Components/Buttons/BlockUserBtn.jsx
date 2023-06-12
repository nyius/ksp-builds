import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setUserToBlock } from '../../../../context/auth/AuthActions';

/**
 * Button to block a user
 * @returns
 */
function BlockUserBtn() {
	const { user, dispatchAuth, fetchedUserProfile } = useContext(AuthContext);

	return (
		<div className="tooltip" data-tip="Block">
			<Button htmlFor="block-modal" color="btn-error" size="w-full" icon="cancel" text={user?.blockList?.includes(fetchedUserProfile.uid) ? 'Unblock' : 'Block'} onClick={() => setUserToBlock(dispatchAuth, fetchedUserProfile.uid)} />
		</div>
	);
}

export default BlockUserBtn;
