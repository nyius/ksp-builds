import React, { useContext, useState } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import { AiFillCamera } from 'react-icons/ai';
import { uploadProfilePicture } from '../../../context/auth/AuthUtils';
import { useUpdateProfile } from '../../../context/auth/AuthActions';
import { toast } from 'react-toastify';
import Spinner1 from '../../../components/spinners/Spinner1';

/**
 * Displays the users profile photo
 * @returns
 */
function ProfilePicture() {
	const { user } = useContext(AuthContext);
	const { updateUserProfilePic } = useUpdateProfile();
	const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);

	/**
	 * Gets te new uploaded profile photo and updates the used DB
	 * @param {*} e
	 */
	const handleNewProfilePhoto = async e => {
		await uploadProfilePicture(e, setUploadingProfilePhoto, user.uid)
			.then(url => {
				updateUserProfilePic(url);
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
		</>
	);
}

export default ProfilePicture;
