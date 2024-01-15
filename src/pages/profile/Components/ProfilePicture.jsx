import React, { useState } from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { AiFillCamera } from 'react-icons/ai';
import { uploadProfilePicture } from '../../../context/auth/AuthUtils';
import { useUpdateProfile } from '../../../context/auth/AuthActions';
import Spinner2 from '../../../components/spinners/Spinner2';
import TooltipPopup from '../../../components/tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';

/**
 * Displays the users profile photo
 * @returns
 */
function ProfilePicture() {
	const { user } = useAuthContext();
	const { updateUserProfilePic } = useUpdateProfile();
	const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);

	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

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
			.catch(() => {
				setUploadingProfilePhoto(false);
			});
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="indicator self-center">
				<div className="avatar">
					<div className="rounded-full w-35 h-35  2k:h-44 2k:w-44 ring ring-primary ring-offset-base-100 ring-offset-4">{uploadingProfilePhoto ? <Spinner2 /> : <img src={user.profilePicture} alt="" />}</div>
				</div>
				<label ref={setTriggerRef} htmlFor="profile-picture-upload" className="indicator-item indicator-bottom text-3xl cursor-pointer rounded-full p-4 bg-base-600">
					<AiFillCamera />
				</label>
				<TooltipPopup getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} visible={visible} text="Edit Profile Picture" />

				<input type="file" id="profile-picture-upload" max="1" accept=".jpg,.png,.jpeg" className="hidden-file-input file-input 2k:file-input-lg 2k:text-3xl" onChange={handleNewProfilePhoto} />
			</div>
		</>
	);
}

export default ProfilePicture;
