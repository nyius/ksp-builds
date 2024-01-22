import React, { useState, useEffect } from 'react';
import Spinner2 from '../spinners/Spinner2';
import { toast } from 'react-toastify';
import AccoladeLight from './AccoladeLight';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';

/**
 * Displays a grid of all of the accolades
 * @param {*} user - the user whose accolades we want to display
 * @param {*} type - what kind of browser to display ('profile'/'user' for only unlocked awards, 'full' for all accolades)
 * @returns
 */
function AccoladeBrowser({ user, type }) {
	const { fetchedAccolades, accoladesLoading } = useAccoladesContext();

	if (accoladesLoading) return <Spinner2 />;

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className={`grid ${type === 'full' ? 'grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2k:grid-cols-6 gap-16 2k:gap-24 items-start' : 'grid-cols-3 sm:grid-cols-4 2k:grid-cols-4 gap-10 2k:gap-16'} w-full`}>
			{user?.accolades?.length === 0 ? (
				<div className="text-xl 2k:text-2xl italic col-span-3">This user has no accolades yet!</div>
			) : (
				<>
					{fetchedAccolades.map(accolade => {
						return <AccoladeLight key={accolade.id} user={user} type={type} accolade={accolade} size="w-full" />;
					})}
				</>
			)}
		</div>
	);
}

export default AccoladeBrowser;
