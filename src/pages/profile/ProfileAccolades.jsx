import React, { useEffect, useState } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import HelmetHeader from '../../components/Helmet/Helmet';
import PlanetHeader from '../../components/header/PlanetHeader';
import AccoladeBrowser from '../../components/accolades/AccoladeBrowser';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import Button from '../../components/buttons/Button';
import { useNavigate } from 'react-router-dom';

/**
 * Displays the accolade page
 * @returns
 */
function ProfileAccolades() {
	const { user, authLoading } = useAuthContext();
	const navigate = useNavigate();
	const { fetchedAccolades, accoladesLoading, totalAccoladeCount, totalAccoladePoints } = useAccoladesContext();
	const [accoladeCount, setAccoladeCount] = useState(null);

	useEffect(() => {
		if (!authLoading && user) {
			setAccoladeCount(user.accolades?.length);
		}
	}, [authLoading, user]);

	/**
	 * Handles getting how many points the user has from accolades
	 */
	const getTotalPoints = () => {
		let totalPoints = 0;
		user.accolades.map(userAccolade => {
			const accolade = getFullAccolade(userAccolade);

			if (accolade) {
				return (totalPoints += Number(accolade.points));
			}
		});

		return totalPoints;
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
	return (
		<>
			<HelmetHeader title="Accolades" pagelink="https://kspbuilds.com/profile/accolades" description="View your KSP Builds accolades." />
			<MiddleContainer size="w-full lg:w-3/4 justify-self-center">
				<PlanetHeader text={`Accolades`} />
				<Button icon="left2" text="Back to profile" color="btn-ghost" position="self-start" onClick={() => navigate(`/profile`)} />

				<div className="rounded-xl p-4 2k:p-8 mb-10 bg-gradient-to-r from-[#0c0e12] border-2 border-solid border-base-300 shadow-xl ">
					<div className="flex flex-col w-full gap-4 2k:gap-6 ">
						<div className="flex flex-row gap-5 2k:gap-10">
							<div className="font-bold mr-6 2k:mr-10 text-2xl 2k:text-3xl w-[9rem] ">
								<span className="text-success"> {!authLoading && accoladeCount ? accoladeCount : 0}</span> / {!accoladesLoading && totalAccoladeCount}
							</div>
							<div className="text-lg 2k:text-xl text-slate-200 pixel-font">Accolades</div>
						</div>
						<div className="divider !my-0 "></div>
						<div className="flex flex-row gap-5 2k:gap-10">
							<div className="font-bold mr-6 2k:mr-10 text-2xl 2k:text-3xl w-[9rem] ">
								<span className="text-success"> {!authLoading && !accoladesLoading ? getTotalPoints() : ''}</span> / {!accoladesLoading ? totalAccoladePoints : ''}{' '}
							</div>
							<div className="text-lg 2k:text-xl text-slate-200 pixel-font">Rocket Reputation</div>
						</div>
					</div>
				</div>

				{!authLoading && user ? <AccoladeBrowser user={user} type="full" /> : ''}
			</MiddleContainer>
		</>
	);
}

export default ProfileAccolades;
