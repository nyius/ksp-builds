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
import BuildCard from '../../components/buildCard/BuildCard';
import Sort from '../../components/sort/Sort';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
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
	const { fetchUsersProfile, setAccountToDelete, handleFollowingUser, sendMessage, fetchConversation } = useAuth();
	const { filterBuilds, resetFilters } = useFilters();
	const { fetchBuilds } = useBuilds();

	// Fetches the users profile first so we know what builds they have
	useEffect(() => {
		fetchUsersProfile(usersId);
	}, []);

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (fetchedUserProfile) {
			fetchBuilds(fetchedUserProfile.builds, fetchedUserProfile.uid);
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

						<div className="flex flex-row relative gap-14 items-center mb-10 bg-base-400 rounded-xl p-6 2k:p-12">
							{!authLoading && user?.username && user?.uid !== fetchedUserProfile.uid && (
								<div className="absolute right-2 top-2 flex flex-row gap-2 2k:gap-4">
									<div className="tooltip" data-tip={`${fetchedUserProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}>
										<Button icon={`${fetchedUserProfile.followers?.includes(user.uid) ? 'fill-heart' : 'outline-heart'}`} color="btn-primary" onClick={() => handleFollowingUser()} />
									</div>
									<div className="tooltip" data-tip="Message">
										<Button text="Message" icon="comment" color="btn-primary" onClick={() => fetchConversation(fetchedUserProfile)} />
									</div>
								</div>
							)}
							{/* Profile Picture */}
							<div className="avatar">
								<div className="rounded-full w-44 ring ring-primary ring-offset-base-100 ring-offset-4">
									<img src={fetchedUserProfile.profilePicture} alt="" />
								</div>
							</div>

							{/* Username/bio/created */}
							<div className="flex flex-col gap-3 2k:gap-6 w-full">
								<p className="text-xl 2k:text-3xl">
									<span className="text-slate-500 2k:text-2xl italic">Username: </span> {fetchedUserProfile.username}
								</p>

								<p className="text-xl 2k:text-3xl">
									<span className="text-slate-500 2k:text-2xl italic">Date Created: </span> {dateCreated}
								</p>

								<div className="flex flex-row gap-2">
									<p className="text-slate-500 text-xl 2k:text-2xl italic">Bio: </p>
									<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
								</div>
							</div>
						</div>
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4">{fetchedUserProfile.username}'s Builds</h2>

						{/* Builds */}
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
