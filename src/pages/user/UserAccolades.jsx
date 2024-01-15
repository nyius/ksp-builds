import React, { useEffect, useState } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import HelmetHeader from '../../components/Helmet/Helmet';
import PlanetHeader from '../../components/header/PlanetHeader';
import AccoladeBrowser from '../../components/accolades/AccoladeBrowser';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAndSetOpenUserProfile } from '../../context/auth/AuthActions';
import Button from '../../components/buttons/Button';

/**
 * Displays the accolade page
 * @returns
 */
function UserAccolades() {
	const { openProfile, fetchingProfile } = useAuthContext();
	const { fetchedAccolades, accoladesLoading, totalAccoladeCount, totalAccoladePoints } = useAccoladesContext();
	const [accoladeCount, setAccoladeCount] = useState(null);
	const navigate = useNavigate();

	const usersId = useParams().id;
	useGetAndSetOpenUserProfile(usersId);

	useEffect(() => {
		if (!fetchingProfile && openProfile && !accoladesLoading) {
			setAccoladeCount(openProfile.accolades?.length);
		}
	}, [fetchingProfile, openProfile]);

	/**
	 * Handles getting how many points the user has from accolades
	 */
	const getTotalPoints = () => {
		let pointsTotal = 0;
		openProfile?.accolades?.map(userAccolade => {
			const accolade = getFullAccolade(userAccolade);

			if (accolade) {
				pointsTotal += Number(accolade.points);
			}
		});

		return pointsTotal;
	};

	/**
	 * Gets the full accolade based on the users accolade
	 * @param {*} accolade
	 * @returns
	 */
	const getFullAccolade = accolade => {
		const fullAccolade = fetchedAccolades.filter(filterAccolade => filterAccolade.id === accolade.id);
		return fullAccolade[0];
	};

	//---------------------------------------------------------------------------------------------------//
	if (!fetchingProfile && openProfile) {
		return (
			<>
				<HelmetHeader
					title={openProfile.username}
					pageLink={`https://kspbuilds.com/profile/${openProfile.username}/accolades`}
					description={`Public KSP Builds profile for ${openProfile.username}. View their builds, send a message, and more.`}
				/>

				<MiddleContainer size="w-full lg:w-3/4 justify-self-center">
					<PlanetHeader text={`Accolades`} />
					<Button icon="left2" text="Back to profile" color="btn-ghost" position="self-start" onClick={() => navigate(`/user/${openProfile.username}`)} />

					<div className="rounded-xl bg-base-500 p-4 mb-10">
						<div className="text-2xl 2k:text-3xl grid grid-cols-2 w-fit gap-4 2k:gap-6 ">
							<div className="font-bold text-success mr-6 2k:mr-10 text-2xl 2k:text-3xl">
								{!fetchingProfile && accoladeCount ? accoladeCount : 0} / {!accoladesLoading && totalAccoladeCount}
							</div>
							<div className="text-xl 2k:text-2xl text-slate-100">Accolades</div>
							<div className="font-bold text-success mr-6 2k:mr-10 text-2xl 2k:text-3xl">
								{!fetchingProfile && !accoladesLoading ? getTotalPoints() : ''} / {!accoladesLoading ? totalAccoladePoints : ''}{' '}
							</div>
							<div className="text-xl 2k:text-2xl text-slate-100">Rocket Reputation</div>
						</div>
					</div>

					{!fetchingProfile && openProfile ? <AccoladeBrowser user={openProfile} type="full" /> : ''}
				</MiddleContainer>
			</>
		);
	}
}

export default UserAccolades;
