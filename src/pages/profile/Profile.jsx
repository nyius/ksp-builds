import React, { useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { AiFillCamera } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { convertFromRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import BuildsContext from '../../context/builds/BuildsContext';
import useBuilds from '../../context/builds/BuildsActions';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
import useAuth from '../../context/auth/AuthActions';
import useResetStates from '../../utilities/useResetStates';
import checkIfJson from '../../utilities/checkIfJson';
//---------------------------------------------------------------------------------------------------//
import BuildCard from '../../components/cards/BuildCard';
import Spinner1 from '../../components/spinners/Spinner1';
import Sort from '../../components/sort/Sort';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import TextEditor from '../../components/textEditor/TextEditor';
import BotwBadge from '../../assets/BotW_badge2.png';
import BuildInfoCard from '../../components/cards/BuildInfoCard';

/**
 * Displays the users own profile
 * @returns
 */
function Profile() {
	const navigate = useNavigate();
	const { typeFilter, versionFilters, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const { fetchedBuilds, loadingBuilds } = useContext(BuildsContext);
	const { user, authLoading, editingProfile } = useContext(AuthContext);
	//---------------------------------------------------------------------------------------------------//
	const { setEditingProfile, updateUserDbBio, uploadProfilePicture, updateUserDbProfilePic } = useAuth();
	const { fetchUsersBuilds, setBuildsLoading, clearFetchedBuilds } = useBuilds();
	const { filterBuilds, resetFilters } = useFilters();
	//---------------------------------------------------------------------------------------------------//
	const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const [dateCreated, setDateCreated] = useState(null);
	const [bioLength, setBioLength] = useState(1000);
	const [editedBio, setEditedBio] = useState(null);
	const [bioState, setBioState] = useState(null);

	useEffect(() => {
		if (user?.dateCreated) {
			setDateCreated(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(user.dateCreated.seconds * 1000));
		}
	}, []);

	const { resetStates } = useResetStates();

	// Reset edidtingBuild/editingComment stats on page load
	useEffect(() => {
		resetStates();
		resetFilters();
	}, []);

	useEffect(() => {
		clearFetchedBuilds();

		if (!authLoading) {
			if (user?.username && user?.builds.length > 0) {
				fetchUsersBuilds(user.builds, user.uid);
				setBioLength(user.bio.length);
			} else {
				setBuildsLoading(false);
			}

			if (checkIfJson(user?.bio)) {
				setBioState(EditorState.createWithContent(convertFromRaw(JSON.parse(user?.bio))));
			} else {
				setBioState(EditorState.createWithContent(ContentState.createFromText(user?.bio)));
			}
		}
	}, [authLoading]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	/**
	 * Handles updating the users bio
	 */
	const handleSubmitBioUpdate = async () => {
		if (editedBio) {
			await updateUserDbBio(editedBio);
			setEditingProfile(false);
			setBioState(EditorState.createWithContent(convertFromRaw(JSON.parse(editedBio))));
		} else {
			setEditingProfile(false);
		}
	};

	/**
	 * Gets te new uploaded profile photo and updates the used DB
	 * @param {*} e
	 */
	const handleNewProfilePhoto = async e => {
		await uploadProfilePicture(e, setUploadingProfilePhoto)
			.then(url => {
				updateUserDbProfilePic(url);
				setUploadingProfilePhoto(false);
			})
			.catch(err => {
				console.log(err);
				toast.error('Something went wrong');
				setUploadingProfilePhoto(false);
			});
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Profile</title>
				<link rel="canonical" href={`https://kspbuilds.com/profile`} />
			</Helmet>

			<MiddleContainer color="none">
				<PlanetHeader text="Profile" />
				{!authLoading && user?.username && (
					<>
						<div className="flex flex-col gap-20 mb-10 bg-base-400 border-2 border-dashed border-slate-700 rounded-xl p-6 2k:p-12">
							<div className="flex flex-col md:flex-row gap-20 items-center">
								{/* Profile Picture */}
								<div className="indicator">
									<div className="avatar">
										<div className="rounded-full w-44 ring ring-primary ring-offset-base-100 ring-offset-4">{uploadingProfilePhoto ? <Spinner1 /> : <img src={user.profilePicture} alt="" />}</div>
									</div>
									<div className="tooltip" data-tip="Edit Profile Picture">
										<label htmlFor="profile-picture-upload" className="indicator-item indicator-bottom text-3xl cursor-pointer rounded-full p-4 bg-base-600">
											<AiFillCamera />
										</label>

										<input type="file" id="profile-picture-upload" max="1" accept=".jpg,.png,.jpeg" className="hidden-file-input file-input 2k:file-input-lg 2k:text-3xl" onChange={handleNewProfilePhoto} />
									</div>
								</div>

								<div className="flex flex-col gap-3 2k:gap-6 w-full">
									{/* Username */}
									<p className="text-xl 2k:text-3xl font-thin text-white">
										<span className="text-slate-500 text-xl 2k:text-2xl italic">Username: </span> {user.username}
									</p>

									{editingProfile ? (
										<>
											{/* Bio Edit */}
											<TextEditor setState={setEditedBio} />

											{/* Buttons */}
											<div className="flex flex-row gap-4">
												<Button text="Save" icon="save" onClick={handleSubmitBioUpdate} size="w-fit" />
												<Button text="Cancel" icon="cancel" onClick={() => setEditingProfile(false)} size="w-fit" />
											</div>
										</>
									) : (
										<div>
											<div className="flex flex-row gap-2">
												{/* Bio */}
												<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
											</div>
											<Button text="Edit Bio" icon="edit" onClick={() => setEditingProfile({ bio: user.bio })} size="btn-sm 2k:btn-md w-fit" margin="mt-3 2k:mt-6 mb-4" />
										</div>
									)}
									<p className="text-xl 2k:text-3xl">
										<span className="text-slate-500 text-xl 2k:text-2xl italic">Email:</span> {user.email}
									</p>
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
									<p className="text-xl 2k:text-3xl text-accent">{user.rocketReputation}</p>
								</BuildInfoCard>
								{user?.username && user?.buildOfTheWeekWinner && (
									<BuildInfoCard>
										<img src={BotwBadge} alt="" className="w-22 2k:w-44" />
										<p className="text-lg xl:text-2xl 2k:text-3xl font-bold">Build of the Week Winner</p>
									</BuildInfoCard>
								)}
							</div>
						</div>

						{/* Builds */}
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4">Your Builds</h2>

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
										<CantFind text="You have no builds yet!">
											<Button text="Create your first" icon="plus" onClick={() => navigate('/upload')} color="btn-primary" />
										</CantFind>
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
					</>
				)}
			</MiddleContainer>
		</>
	);
}

export default Profile;
