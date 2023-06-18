import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the favorites button
 * @returns
 */
function FavoritesBtn() {
	return <Button type="ahref" href="/favorites" size="w-full" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="fill-heart" text="Favorites" />;
}

export default FavoritesBtn;
