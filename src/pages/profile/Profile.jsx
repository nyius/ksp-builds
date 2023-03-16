import React, { useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { AiFillCamera } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import BuildsContext from '../../context/builds/BuildsContext';
import useBuilds from '../../context/builds/BuildsActions';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
import useAuth from '../../context/auth/AuthActions';
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//
import BuildCard from '../../components/buildCard/BuildCard';
import Spinner1 from '../../components/spinners/Spinner1';
import Sort from '../../components/sort/Sort';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';

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
	const { fetchBuilds, setBuildsLoading, clearFetchedBuilds } = useBuilds();
	const { filterBuilds, resetFilters } = useFilters();
	//---------------------------------------------------------------------------------------------------//
	const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const [dateCreated, setDateCreated] = useState(null);
	const [bioLength, setBioLength] = useState(1000);
	const [bio, setBio] = useState('');

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
				fetchBuilds(user.builds, user.uid);
				setBioLength(user.bio.length);
			} else {
				setBuildsLoading(false);
			}
		}
	}, [authLoading]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	/**
	 * handles setting the bio and updating the total length
	 * @param {*} e
	 */
	const handleSetBio = e => {
		setBio(e.target.value);
		setBioLength(prevState => 1000 - e.target.value.length);
	};

	/**
	 * Handles updating the users bio
	 */
	const handleSubmitBioUpdate = async () => {
		await updateUserDbBio(bio);
		setEditingProfile(false);
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
						<div className="flex flex-col md:flex-row gap-20 items-center mb-10 bg-base-400 border-2 border-dashed border-slate-700 rounded-xl p-6 2k:p-12">
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
								<p className="text-xl 2k:text-3xl font-thin">
									<span className="text-slate-500 text-xl 2k:text-2xl italic">Username: </span> {user.username}
								</p>

								{/* Created */}
								<p className="text-xl 2k:text-3xl">
									<span className="text-slate-500 2k:text-2xl italic">Date Created: </span> {dateCreated}
								</p>

								{editingProfile ? (
									<>
										{/* Bio Edit */}
										<textarea onChange={handleSetBio} defaultValue={user.bio} maxLength="1000" rows="4" className="textarea w-full text-xl"></textarea>
										<p className="text-slate-400 italic 2k:text-2xl">{bioLength}</p>

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
											<p className="text-slate-500 text-xl 2k:text-2xl italic">Bio: </p>
											{user.bio === '' ? <p className="italic text-slate-500 text-xl 2k:text-3xl">No bio yet</p> : <p className="text-xl 2k:text-3xl"> {user.bio} </p>}
										</div>
										<Button text="Edit Bio" icon="edit" onClick={() => setEditingProfile(true)} size="btn-sm 2k:btn-md w-fit" margin="mt-3 2k:mt-6 mb-4" />
									</div>
								)}
								<p className="text-xl 2k:text-3xl">
									<span className="text-slate-500 text-xl 2k:text-2xl italic">Email:</span> {user.email}
								</p>
							</div>
						</div>
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4">Your Builds</h2>

						{/* Builds */}
						<Sort />
						<div className="flex flex-wrap md:grid md:grid-cols-3 2k:grid-cols-4 gap-4 w-full items-center justify-center md:justify-items-center mb-6 p-6 md:p-0">
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
											<Button text="Create your first" icon="plus" onClick={() => navigate('/create')} color="btn-primary" />
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
