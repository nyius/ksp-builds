import React, { useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { auth, db, storage } from '../../firebase.config';
import { toast } from 'react-toastify';
import LogoIcon from '../../assets/logo_light_icon.png';
import Spinner1 from '../spinners/Spinner1';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
import { uploadImage } from '../../utilities/uploadImage';

function NewGoogleAccountModal() {
	const [newUsername, setNewUsername] = useState('');
	const [uploadingImage, setUploadingImage] = useState(false);
	const [newProfilePicture, setNewProfilePicture] = useState(LogoIcon);

	const { user, newGoogleSignup } = useContext(AuthContext);
	const { setNewGoogleSignup, updateUserState, uploadProfilePicture, updateUserDbProfilePic } = useAuth();
	const newGoogleAccountModal = document.querySelector('#new-google-login-modal');

	/**
	 * Handles finalizing the account creation for google users
	 */
	const finalizeGoogleAccount = e => {
		e.preventDefault();

		if (!newUsername || newUsername === '') {
			console.log(`No username entered!`);
			toast.error('You need a username!');
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
					toast.error('That username already exists! Try another one.');
				} else {
					const updateUser = {
						username,
						profilePicture: newProfilePicture ? newProfilePicture : 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/logo_light_icon.png?alt=media&token=bbcff4bd-de9e-4d39-b77e-7046f90ed832',
					};

					await updateDoc(doc(db, 'users', user.uid), updateUser)
						.then(() => {
							setNewGoogleSignup(false);
							updateUserState(updateUser);
							toast.success('Account Created!');
						})
						.catch(err => {
							console.log(err);
							toast.error('Something went wrong :(');
							return;
						});

					const newUsername = {
						uid: user.uid,
					};

					// this adds the user to the 'usernames' db. This is so we can check if a username is already taken or not, quickly and simply
					await setDoc(doc(db, 'usernames', username), newUsername)
						.then(() => {
							console.log('created new usernames entry');
						})
						.catch(err => {
							console.log(err);
							toast.error('Something went wrong :(');
						});

					// Update the userProfiles DB. This is for visiting a users page so we don't have to pull all sensitive data
					await updateDoc(doc(db, 'userProfiles', user.uid), updateUser);
				}
			} catch (error) {
				console.log(error);
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
		await uploadProfilePicture(e, setUploadingImage)
			.then(url => {
				setNewProfilePicture(url);
				updateUserDbProfilePic(url);
				setUploadingImage(false);
			})
			.catch(err => {
				console.log(err);
				toast.error('Something went wrong');
				setUploadingImage(false);
			});
	};

	// Check when we get a new google account setup, so we can show/hide the modal to enter a new username ------------------------------------------------------------------------------------//
	useEffect(() => {
		if (newGoogleSignup) {
			if (newGoogleAccountModal) {
				newGoogleAccountModal.checked = true;
			}
		} else {
			if (newGoogleAccountModal) {
				newGoogleAccountModal.checked = false;
			}
		}
	}, [newGoogleSignup]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{/* New Google Account */}
			<input type="checkbox" id="new-google-login-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<div className="font-bold alert dot-bg text-xl 2k:text-3xl mb-4">
						Almost done...
						<img className="w-12 2k:w-24" src={LogoIcon} alt="" />
					</div>
					<p className="py-4 mb-4 2k:mb-8 text-center text-xl 2k:text-3xl">Please take a second to finalize your account.</p>
					<form action="" className="mb-10">
						<label htmlFor="usernam" className="text-xl 2k:text-2xl text-slate-400 italic">
							Username
						</label>
						<input
							className="input 2k:input-lg 2k:text-2xl bg-base-200 mt-2 mb-6 2k:mb-10 w-full"
							type="text"
							id="username"
							onChange={e => {
								setNewUsername(e.target.value);
							}}
							required
						/>

						<label htmlFor="profile-picture" className="w-full flex mb-2 text-xl 2k:text-2xl text-slate-400 italic">
							Profile Picture (2mb max size)
						</label>

						<div className="flex flex-row flex-wrap items-center">
							<div className="mr-4">{uploadingImage ? <Spinner1 /> : <img className="avatar-round 2k:w-18" src={newProfilePicture} />}</div>
							<input type="file" id="profile-picture" max="1" accept=".jpg,.png,.jpeg" className="file-input 2k:file-input-lg 2k:text-3xl" onChange={handleNewProfilePhoto} />
						</div>
					</form>

					<button className="btn 2k:btn-lg 2k:text-2xl btn-primary mt-6" onClick={e => finalizeGoogleAccount(e)}>
						Create
					</button>
				</div>
			</div>
		</>
	);
}

export default NewGoogleAccountModal;
