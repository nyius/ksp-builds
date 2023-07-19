import React from 'react';
import Button from './Button';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useBuildContext } from '../../context/build/BuildContext';
import { useHandleFavoriting } from '../../context/auth/AuthActions';
import CheckCredentials from '../credentials/CheckCredentials';

/**
 * Handles favoriting a build
 * @param {string} id - id of the build to favorite
 * @param {string} text - (optional) text to display on the btn
 * @returns
 */
function Favorite({ id }) {
	const { user } = useAuthContext();
	const { loadedBuild } = useBuildContext();
	const { handleFavoriting } = useHandleFavoriting();

	return (
		<CheckCredentials type="favorite">
			<Button
				css={`
					${user?.favorites?.includes(id ? id : loadedBuild.id) ? 'text-secondary' : null} normal-case
				`}
				onClick={() => handleFavoriting(id ? id : loadedBuild.id)}
				color="btn-ghost"
				tooltip="Favorite"
				icon={user?.favorites?.includes(id ? id : loadedBuild.id) ? 'fill-heart' : 'outline-heart'}
			/>
		</CheckCredentials>
	);
}

export default Favorite;
