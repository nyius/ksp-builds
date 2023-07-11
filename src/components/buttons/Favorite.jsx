import React, { useContext } from 'react';
import Button from './Button';
import AuthContext from '../../context/auth/AuthContext';
import BuildContext from '../../context/build/BuildContext';
import { useHandleFavoriting } from '../../context/auth/AuthActions';
import CheckCredentials from '../credentials/CheckCredentials';

/**
 * Handles favoriting a build
 * @param {string} id - id of the build to favorite
 * @param {string} text - (optional) text to display on the btn
 * @returns
 */
function Favorite({ id }) {
	const { user } = useContext(AuthContext);
	const { loadedBuild } = useContext(BuildContext);
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
