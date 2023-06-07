import React, { useContext } from 'react';
import Button from './Button';
import AuthContext from '../../context/auth/AuthContext';
import BuildContext from '../../context/build/BuildContext';
import { useHandleFavoriting } from '../../context/auth/AuthActions';

/**
 * Handles favoriting a build
 * @returns
 */
function Favorite({ id }) {
	const { authLoading, user } = useContext(AuthContext);
	const { loadedBuild } = useContext(BuildContext);
	const { handleFavoriting } = useHandleFavoriting();

	if (!authLoading) {
		if (user?.username && user?.favorites) {
			return (
				<Button
					css={user.favorites?.includes(id ? id : loadedBuild.id) && 'text-secondary'}
					onClick={() => handleFavoriting(id ? id : loadedBuild.id)}
					color="btn-ghost"
					tooltip="Favorite"
					icon={user.favorites?.includes(id ? id : loadedBuild.id) ? 'fill-heart' : 'outline-heart'}
				/>
			);
		}
	}
}

export default Favorite;
