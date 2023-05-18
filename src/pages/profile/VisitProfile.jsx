import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { convertFromRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import BuildCard from '../../components/cards/BuildCard';
import Sort from '../../components/sort/Sort';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import BotwBadge from '../../assets/BotW_badge2.png';
import UsernameLink from '../../components/buttons/UsernameLink';
import BuildInfoCard from '../../components/cards/BuildInfoCard';
//---------------------------------------------------------------------------------------------------//
import checkIfJson from '../../utilities/checkIfJson';

function VisitProfile() {
	const usersId = useParams().id;
	const navigate = useNavigate();
	//---------------------------------------------------------------------------------------------------//
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const [dateCreated, setDateCreated] = useState(null);
	const [bioState, setBioState] = useState(null);
	//---------------------------------------------------------------------------------------------------//
	const { typeFilter, versionFilter, searchTerm, tagsSearch, modsFilter, challengeFilter, sortBy } = useContext(FiltersContext);
	const { fetchedBuilds, loadingBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { fetchedUserProfile, fetchingProfile, user, authLoading } = useContext(AuthContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchUsersProfile, setAccountToDelete, handleFollowingUser, setUserToBlock, fetchConversation, setReport } = useAuth();
	const { filterBuilds, resetFilters } = useFilters();
	const { fetchUsersBuilds } = useBuilds();

	// Fetches the users profile first so we know what builds they have
	useEffect(() => {
		fetchUsersProfile(usersId);
	}, []);

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (fetchedUserProfile) {
			fetchUsersBuilds(fetchedUserProfile.builds, fetchedUserProfile.uid);
			setDateCreated(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(fetchedUserProfile.dateCreated.seconds * 1000));

			if (checkIfJson(fetchedUserProfile?.bio)) {
				setBioState(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedUserProfile?.bio))));
			} else {
				setBioState(EditorState.createWithContent(ContentState.createFromText(fetchedUserProfile?.bio)));
			}
		}
	}, [fetchedUserProfile]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	/**
	 * Handles setting the reported comment
	 */
	const handleSetReport = () => {
		setReport('user', fetchedUserProfile);
	};

	/**
	 * handles setting the user to blocks id for the modal
	 */
	const handleSetUserToBlock = () => {
		setUserToBlock(fetchedUserProfile.uid);
	};

	//---------------------------------------------------------------------------------------------------//
	if (fetchingProfile) {
		return <Spinner1 />;
	} else {
		// If we find a profile
		if (fetchedUserProfile) {
			return (
				<>
					<Helmet>
						<meta charSet="utf-8" />
						<title>KSP Builds - {fetchedUserProfile.username}</title>
						<link rel="canonical" href={`https://kspbuilds.com/profile/${fetchedUserProfile.uid}`} />
					</Helmet>

					<MiddleContainer color="none">
						{!authLoading && user?.siteAdmin && <Button htmlFor="delete-account-modal" text="Delete Account (admin)" onClick={() => setAccountToDelete(usersId)} />}

						<div className="flex flex-col relative gap-14 items-center mb-10 bg-base-400 rounded-xl p-6 2k:p-12">
							<div className="flex flex-col gap-14 w-full">
								<div className="flex flex-col md:flex-row gap-14 w-full items-center">
									{/* Profile Picture */}
									<div className="flex flex-col gap-3 2k:gap-4 w-full md:w-1/4">
										<div className="avatar mb-4 self-center">
											<div className="rounded-full w-44 ring ring-primary ring-offset-base-100 ring-offset-4">
												<img src={fetchedUserProfile.profilePicture} alt="" />
											</div>
										</div>

										{!authLoading && user?.username && user?.uid !== fetchedUserProfile.uid && (
											<>
												{!fetchedUserProfile.blockList?.includes(user?.uid) && (fetchedUserProfile.allowPrivateMessaging === true || fetchedUserProfile.allowPrivateMessaging === undefined) && (
													<div className="tooltip" data-tip="Message">
														<Button text="Message" size="w-full" icon="comment" color="btn-primary" onClick={() => fetchConversation(fetchedUserProfile)} />
													</div>
												)}

												<div className="tooltip" data-tip={`${fetchedUserProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}>
													<Button
														text={`${fetchedUserProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}
														size="w-full"
														icon={`${fetchedUserProfile.followers?.includes(user.uid) ? 'fill-heart' : 'outline-heart'}`}
														color="btn-accent"
														onClick={() => handleFollowingUser()}
													/>
												</div>

												<div className="tooltip" data-tip="Block">
													<Button htmlFor="block-modal" color="btn-error" size="w-full" icon="cancel" text={user?.blockList?.includes(fetchedUserProfile.uid) ? 'Unblock' : 'Block'} onClick={handleSetUserToBlock} />
												</div>

												<div className="tooltip" data-tip="Report">
													<Button htmlFor="report-modal" color="btn-dark" size="w-full" icon="report" text="Report" onClick={handleSetReport} />
												</div>
											</>
										)}
									</div>

									{/* Username/bio/created */}
									<div className="flex flex-col gap-3 2k:gap-6 w-full md:w-3/4">
										<p className="text-xl 2k:text-3xl text-white">
											<span className="text-slate-500 2k:text-2xl italic">Username: </span> <UsernameLink noHoverUi={true} username={fetchedUserProfile.username} uid={fetchedUserProfile.uid} />
										</p>

										<div className="flex flex-row gap-2 text-white">
											<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
										</div>
									</div>
								</div>

								{/* User Details */}
								<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-900 w-full justify-center p-2 2k:p-4 rounded-xl">
									<BuildInfoCard title="Joined">
										<p className="text-xl 2k:text-3xl text-accent">{dateCreated}</p>
									</BuildInfoCard>
									<BuildInfoCard title="Total Builds">
										<p className="text-xl 2k:text-3xl text-accent">{sortedBuilds.length}</p>
									</BuildInfoCard>
									<BuildInfoCard title="Rocket Reputation">
										<p className="text-xl 2k:text-3xl text-accent">{fetchedUserProfile.rocketReputation}</p>
									</BuildInfoCard>
									{fetchedUserProfile?.buildOfTheWeekWinner && (
										<BuildInfoCard>
											<img src={BotwBadge} alt="" className="w-22 2k:w-44" />
											<p className="text-lg xl:text-2xl 2k:text-3xl font-bold">Build of the Week Winner</p>
										</BuildInfoCard>
									)}
								</div>
							</div>
						</div>

						{/* Builds */}
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4">{fetchedUserProfile.username}'s Builds</h2>
						<Sort />
						<div className="flex flex-row flex-wrap w-full items-stretch justify-center md:justify-items-center mb-6 p-6 md:p-0">
							{loadingBuilds ? (
								<div className="flex flex-row w-full justify-center items-center">
									<div className="w-20">
										<Spinner1 />
									</div>
								</div>
							) : (
								<>
									{fetchedBuilds.length === 0 ? (
										<CantFind text="This user has no builds yet :(" />
									) : (
										<>
											{sortedBuilds.map((build, i) => {
												return <BuildCard key={i} i={i} build={build} />;
											})}
										</>
									)}
								</>
							)}
						</div>
					</MiddleContainer>
				</>
			);
		} else {
			return (
				<CantFind text="Oops.. user not found">
					<Button color="btn-primary" text="Return home" icon="left" onClick={() => navigate('/')} />
				</CantFind>
			);
		}
	}
}

export default VisitProfile;
