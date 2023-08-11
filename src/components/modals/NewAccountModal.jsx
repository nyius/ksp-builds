import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Astrobiff from '../../assets/astrobiff.png';
import Spinner1 from '../spinners/Spinner1';
import { useAuthContext } from '../../context/auth/AuthContext';
import { setNewSignup, useUpdateProfile, updateUserState, setAuthenticated } from '../../context/auth/AuthActions';
import Button from '../buttons/Button';
import { profanity } from '@2toad/profanity';
import TextInput from '../input/TextInput';
import { uploadProfilePicture } from '../../context/auth/AuthUtils';
import Regex from 'regex-username';
import errorReport from '../../utilities/errorReport';

function NewAccountModal() {
	const navigate = useNavigate();
	const [newUsername, setNewUsername] = useState('');
	const [uploadingImage, setUploadingImage] = useState(false);
	const [newProfilePicture, setNewProfilePicture] = useState(Astrobiff);

	const { user, newSignup, dispatchAuth } = useAuthContext();
	const { updateUserProfilePic } = useUpdateProfile();
	const newAccountModal = document.querySelector('#new-account-modal');

	/**
	 * Handles finalizing the account creation
	 */
	const finalizeAccount = e => {
		if (!newUsername || newUsername === '') {
			errorReport(`No username entered!`, false, 'finalizeAccount');
			toast.error('You need a username!');
			return;
		}

		if (newUsername.includes(' ')) {
			toast.error('Username cannot contain spaces!');
			errorReport(`Username cannot contain spaces!`, false, 'finalizeAccount');
			return;
		}

		if (newUsername.length > 50) {
			toast.error('Username is too long! Must be less than 50 characters');
			errorReport(`Username too long`, false, 'finalizeAccount');
			return;
		}

		if (profanity.exists(newUsername)) {
			toast.error('Username not acceptable!');
			errorReport(`Username not acceptable`, false, 'finalizeAccount');
			return;
		}

		if (!Regex().test(newUsername)) {
			toast.error('Username not valid!');
			errorReport(`Username not valid`, false, 'finalizeAccount');
			return;
		}

		// Normalize username
		const username = newUsername.trim().toLowerCase();

		/**
		 * Check if the username already exists in the database
		 */
		const checkIfUserExists = async () => {
			try {
				// Check if the username already exists
				const docRefUser = doc(db, 'usernames', username);
				const docSnapUser = await getDoc(docRefUser);

				// Check if the user exists
				if (docSnapUser.exists()) {
					errorReport('That username already exists! Try another one.', false, 'checkIfUserExists');
					toast.error('That username already exists! Try another one.');
				} else {
					const updateUser = {
						username,
						builds: [],
						upVotes: [],
						downVotes: [],
						profilePicture: newProfilePicture ? newProfilePicture : 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/logo_light_icon.png?alt=media&token=bbcff4bd-de9e-4d39-b77e-7046f90ed832',
					};

					await updateDoc(doc(db, 'users', user.uid), updateUser)
						.then(() => {
							setNewSignup(dispatchAuth, false);
							updateUserState(dispatchAuth, updateUser);
							setAuthenticated(dispatchAuth, true);
							toast.success('Account Created!');
						})
						.catch(err => {
							setAuthenticated(dispatchAuth, false);
							throw new Error(err);
						});

					const newUsername = {
						uid: user.uid,
					};

					// this adds the user to the 'usernames' db. This is so we can check if a username is already taken or not, quickly and simply
					await setDoc(doc(db, 'usernames', username), newUsername);

					// Update the userProfiles DB. This is for visiting a users page so we don't have to pull all sensitive data
					await updateDoc(doc(db, 'userProfiles', user.uid), updateUser);

					navigate('/');
				}
			} catch (error) {
				errorReport(error.message, true, 'checkIfUserExists');
				toast.error('Something went wrong :(');
			}
		};

		checkIfUserExists();
	};

	/**
	 * Gets te new uploaded profile photo and updates the used DB
	 * @param {*} e
	 */
	const handleNewProfilePhoto = async e => {
		await uploadProfilePicture(e, setUploadingImage, user.uid)
			.then(url => {
				setNewProfilePicture(url);
				updateUserProfilePic(url);
				setUploadingImage(false);
			})
			.catch(err => {
				errorReport(err.message, true, 'handleNewProfilePhoto');
				toast.error('Something went wrong');
				setUploadingImage(false);
			});
	};

	// Check when we get a new account setup, so we can show/hide the modal to enter a new username ------------------------------------------------------------------------------------//
	useEffect(() => {
		if (newSignup) {
			if (newAccountModal) {
				newAccountModal.checked = true;
			}
		} else {
			if (newAccountModal) {
				newAccountModal.checked = false;
			}
		}
	}, [newSignup, newAccountModal]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{/* New  Account */}
			<input type="checkbox" id="new-account-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<div className="font-bold alert dot-bg text-xl 2k:text-3xl mb-4 text-slate-200">
						Almost done...
						<img className="w-12 2k:w-24" src={Astrobiff} alt="" />
					</div>
					<p className="py-4 mb-4 2k:mb-8 text-center text-xl 2k:text-3xl text-slate-200">Please take a second to finalize your account.</p>
					<div className="mb-10">
						<label htmlFor="usernam" className="text-xl 2k:text-2xl text-slate-200 italic">
							Username
						</label>
						<TextInput
							id="username"
							maxLength="50"
							size="w-full"
							margin="mt-2 mb-6 2k:mb-10"
							color="bg-base-200"
							onChange={e => {
								setNewUsername(e.target.value);
							}}
							required={true}
						/>

						<label htmlFor="profile-picture" className="w-full flex mb-2 text-xl 2k:text-2xl text-slate-200 italic">
							Optional - Profile Picture (2mb max size)
						</label>

						<div className="flex flex-row flex-wrap items-center">
							<div className="mr-4">{uploadingImage ? <Spinner1 /> : <img className="avatar-round 2k:w-18" src={newProfilePicture} />}</div>
							<input type="file" id="profile-picture" max="1" accept=".jpg,.png,.jpeg" className="file-input 2k:file-input-lg 2k:text-3xl" onChange={handleNewProfilePhoto} />
						</div>
					</div>

					<Button icon="save" text="Create" onClick={e => finalizeAccount(e)} color="btn-primary" margin="mt-6" />
				</div>
			</div>
		</>
	);
}

export default NewAccountModal;
