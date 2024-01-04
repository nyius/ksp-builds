import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import { useAuthContext } from '../../context/auth/AuthContext';
import { setOpenProfile, useGetAndSetOpenUserProfile } from '../../context/auth/AuthActions';
import { setFetchedBuilds, useGetFilteredBuilds } from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Spinner2 from '../../components/spinners/Spinner2';
import { useCheckOpenProfileHangarAndFetchBuilds, useResetOpenHangar, useSetBuildToAddToHangar, useSetHangarLocation, useSetOpenUsersHangars } from '../../context/hangars/HangarActions';
import Sort from '../../components/sort/Sort';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Builds from '../../components/builds/Builds';
import Hangars from '../../components/folders/Hangars';
import Helmet from '../../components/Helmet/Helmet';
//---------------------------------------------------------------------------------------------------//
import DeleteAccountBtn from './Components/Buttons/DeleteAccountBtn';
import ProfilePicture from './Components/Buttons/ProfilePicture';
import MessageUserBtn from '../../components/buttons/MessageUserBtn';
import FollowUserBtn from '../../components/buttons/FollowUserBtn';
import BlockUserBtn from '../../components/buttons/BlockUserBtn';
import ReportUserBtn from '../../components/buttons/ReportUserBtn';
import Username from './Components/Username';
import UserBio from './Components/UserBio';
import UserDetails from './Components/UserDetails';
import BuildsViewBtn from '../../components/buttons/BuildsViewBtn';
import { useHangarContext } from '../../context/hangars/HangarContext';
import { useBuildsContext } from '../../context/builds/BuildsContext';

/**
 * The page to display a user
 * @returns
 */
function User() {
	const usersId = useParams().id;
	const navigate = useNavigate();
	//---------------------------------------------------------------------------------------------------//
	const [sortedBuilds] = useGetFilteredBuilds([]);
	const { openProfile, fetchingProfile, user, authLoading, dispatchAuth, isAuthenticated } = useAuthContext();
	const { openedHangar } = useHangarContext();
	const { dispatchBuilds } = useBuildsContext();

	useEffect(() => {
		setFetchedBuilds(dispatchBuilds, []);
	}, []);

	useEffect(() => {
		return () => setOpenProfile(dispatchAuth, null);
	}, []);

	useSetHangarLocation('user');
	useGetAndSetOpenUserProfile(usersId);
	useCheckOpenProfileHangarAndFetchBuilds(usersId);
	useSetOpenUsersHangars();
	useResetOpenHangar();
	useSetBuildToAddToHangar(null);

	//---------------------------------------------------------------------------------------------------//
	if (fetchingProfile) {
		return (
			<MiddleContainer>
				<Spinner2 />
			</MiddleContainer>
		);
	}

	if ((!fetchingProfile && !openProfile) || (!fetchingProfile && !openProfile?.username)) {
		return (
			<MiddleContainer>
				<CantFind text="Oops.. user not found">
					<Button color="btn-primary" text="Return home" icon="left" onClick={() => navigate('/')} />
				</CantFind>
			</MiddleContainer>
		);
	}

	if (!fetchingProfile && openProfile) {
		return (
			<>
				<Helmet title={openProfile.username} pageLink={`https://kspbuilds.com/profile/${openProfile.uid}`} description={`Public KSP Builds profile for ${openProfile.username}. View their builds, send a message, and more.`} />

				<MiddleContainer color="none">
					<DeleteAccountBtn />
					<div className="flex flex-col relative gap-14 items-center mb-10 bg-base-400 rounded-xl p-6 2k:p-12">
						<div className="flex flex-col gap-14 w-full">
							<div className="flex flex-col md:flex-row gap-14 w-full items-center">
								<div className="flex flex-col gap-3 2k:gap-4 w-full md:w-1/4">
									<ProfilePicture />

									{!authLoading && isAuthenticated && user?.uid !== openProfile.uid ? (
										<>
											<MessageUserBtn text="Message" />
											<FollowUserBtn text="Follow" />
											<div className="flex flex-row gap-2 2k:gap-4">
												<BlockUserBtn userToBlock={openProfile} />
												<ReportUserBtn userToReport={openProfile} />
											</div>
										</>
									) : null}
								</div>

								<div className="flex flex-col gap-3 2k:gap-6 w-full md:w-3/4">
									<Username />
									<UserBio />
								</div>
							</div>
							<UserDetails />
						</div>
					</div>

					{/* hangars */}
					<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openProfile.username}'s Hangars</h2>
					<Hangars />

					{/* Builds */}
					<div className="flex flex-row flex-wrap gap-4 w-full place-content-between sm:mb-4">
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openedHangar ? openedHangar?.hangarName : `${openProfile.username}'s Builds`}</h2>

						<div className="flex flex-row gap-3 2k:gap-6">
							<Sort />
							<BuildsViewBtn />
						</div>
					</div>
					<Builds buildsToDisplay={sortedBuilds} />
				</MiddleContainer>
			</>
		);
	}
}

export default User;
