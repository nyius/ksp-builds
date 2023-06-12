import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import UsernameLink from '../../../components/buttons/UsernameLink';

/**
 * Displays the users username
 * @returns
 */
function Username() {
	const { fetchedUserProfile } = useContext(AuthContext);

	return (
		<p className="text-xl 2k:text-3xl text-white">
			<span className="text-slate-500 2k:text-2xl italic">Username: </span> <UsernameLink noHoverUi={true} username={fetchedUserProfile.username} uid={fetchedUserProfile.uid} />
		</p>
	);
}

export default Username;
