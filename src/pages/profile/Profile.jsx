import React from 'react';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import { useAuthContext } from '../../context/auth/AuthContext';
import { useResetFilters } from '../../context/filters/FiltersActions';
import { useCheckOpenProfileHangarAndFetchBuilds, useSetBuildToAddToHangar, useSetHangarLocation, useSetSelectedHangars } from '../../context/hangars/HangarActions';
import { useHangarContext } from '../../context/hangars/HangarContext';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../hooks/useResetStates';
import Spinner2 from '../../components/spinners/Spinner2';
import Sort from '../../components/sort/Sort';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Builds from '../../components/builds/Builds';
import Hangars from '../../components/folders/Hangars';
import Helmet from '../../components/Helmet/Helmet';
import ProfilePicture from './Components/ProfilePicture';
import ProfileInfo from './Components/ProfileInfo';
import ProfileDetails from './Components/ProfileDetails';
import FetchAmount from '../../components/fetchAmount/FetchAmount';
import BuildsViewBtn from '../../components/buttons/BuildsViewBtn';
import AccoladesPreview from './Components/AccoladesPreview';

/**
 * Displays the users own profile
 * @returns
 */
function Profile() {
	const { openedHangar } = useHangarContext();
	const { user, authLoading, isAuthenticated, editingBio } = useAuthContext();
	const navigate = useNavigate();

	useResetFilters();
	useResetStates();

	useSetHangarLocation('profile');
	useCheckOpenProfileHangarAndFetchBuilds(user.uid);
	useSetBuildToAddToHangar(null);
	useSetSelectedHangars(null);

	//---------------------------------------------------------------------------------------------------//
	if (authLoading) {
		return (
			<MiddleContainer>
				<Spinner2 />
			</MiddleContainer>
		);
	}

	if (!authLoading && (!user || !isAuthenticated)) {
		navigate('/');
	}

	return (
		<>
			<Helmet title="Profile" pagelink="https://kspbuilds.com/profile" description="View your KSP Builds profile. See your uploads, change your bio & profile picture, and more." />

			<MiddleContainer color="none">
				<PlanetHeader text="Profile" />

				<div className={`flex flex-col lg:flex-row w-full mb-10 gap-10 2k:gap-14 ${editingBio ? 'h-full' : 'lg:h-[35rem] 2k:h-[60rem]'}`}>
					<div className="flex flex-col w-full h-full gap-3 2k:gap-5 bg-base-400 rounded-xl p-6 2k:p-12">
						<div className="flex flex-col h-3/4 md:flex-row gap-20">
							<ProfilePicture />
							<ProfileInfo />
						</div>
						<ProfileDetails />
					</div>
					<AccoladesPreview />
				</div>

				<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">Your Hangars</h2>
				<Hangars />

				<div className="flex flex-row flex-wrap gap-4 w-full place-content-between sm:mb-4">
					<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openedHangar ? openedHangar?.hangarName : 'Your Builds'}</h2>
					<div className="flex flex-row gap-3 2k:gap-5">
						<Sort />
						<FetchAmount />
						<BuildsViewBtn />
					</div>
				</div>
				<Builds />
			</MiddleContainer>
		</>
	);
}

export default Profile;
