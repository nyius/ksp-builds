import React, { useState, useEffect } from 'react';
import Spinner2 from '../spinners/Spinner2';
import { toast } from 'react-toastify';
import AccoladeLight from './AccoladeLight';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import { useAuthContext } from '../../context/auth/AuthContext';
import { cloneDeep } from 'lodash';

/**
 * Displays a grid of all of the accolades
 * @param {*} user - the user whose accolades we want to display
 * @param {*} type - what kind of browser to display ('profile'/'user' for only unlocked awards, 'full' for all accolades)
 * @returns
 */
function AccoladeBrowser({ user, type }) {
	const { fetchedAccolades, accoladesLoading } = useAccoladesContext();
	const [accolades, setAccolades] = useState([]);

	useEffect(() => {
		const filterAccolades = async () => {
			try {
				let filteredAccolades = [];
				let accoladesClone = cloneDeep(fetchedAccolades);

				if (type === 'profile' || type === 'user') {
					accoladesClone.map(fetchedAccolade => {
						// Check if the user has it
						user?.accolades?.map(userAccolade => {
							if (userAccolade.id === fetchedAccolade.id) {
								fetchedAccolade.dateReceived = userAccolade.dateReceived;
							}
						});

						if (fetchedAccolade.dateReceived) {
							filteredAccolades.push(fetchedAccolade);
						}
					});
				} else if (type === 'full') {
					accoladesClone.map(fetchedAccolade => {
						// Check if the user has it
						user?.accolades?.map(userAccolade => {
							if (userAccolade.id === fetchedAccolade.id) {
								fetchedAccolade.dateReceived = userAccolade.dateReceived;
							}
						});

						filteredAccolades.push(fetchedAccolade);
					});
				}

				setAccolades(filteredAccolades);
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong fetching accolades');
			}
		};

		if (!accoladesLoading && fetchedAccolades) {
			filterAccolades();
		}
	}, [user, fetchedAccolades, accoladesLoading]);

	if (accoladesLoading) return <Spinner2 />;

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className={`grid ${type === 'full' ? 'grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2k:grid-cols-6 gap-16 2k:gap-24 items-start' : 'grid-cols-3 sm:grid-cols-4 2k:grid-cols-4 gap-10 2k:gap-16'} w-full`}>
			{accolades?.length === 0 ? (
				<div className="text-xl 2k:text-2xl italic col-span-3">This user has no accolades yet!</div>
			) : (
				<>
					{accolades.map(accolade => {
						if (type === 'full') {
							return <AccoladeLight key={accolade.id} accolade={accolade} size="w-full" />;
						} else {
							if (accolade.dateReceived) {
								return <AccoladeLight key={accolade.id} accolade={accolade} size="w-full" />;
							}
						}
					})}
				</>
			)}
		</div>
	);
}

export default AccoladeBrowser;
