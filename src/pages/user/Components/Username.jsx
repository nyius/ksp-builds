import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import UsernameLink from '../../../components/username/UsernameLink';

/**
 * Displays the users username
 * @returns
 */
function Username() {
	const { openProfile } = useAuthContext();

	return (
		<p className="font-black">
			<UsernameLink css="!text-2xl 2k:!text-3xl" noHoverUi={true} username={openProfile.username} uid={openProfile.uid} />
		</p>
	);
}

export default Username;
