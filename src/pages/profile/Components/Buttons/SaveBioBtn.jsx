import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingBio } from '../../../../context/auth/AuthActions';
import { convertFromRaw, EditorState } from 'draft-js';
import { useUpdateProfile } from '../../../../context/auth/AuthActions';

/**
 * Button for editing the users bio
 * @param {string} editedBio - the new bio to save
 * @param {setter} setBioState - the state setter function that displays the users BIO on their profile
 * @returns
 */
function SaveBioBtn({ editedBio, setBioState }) {
	const { dispatchAuth } = useContext(AuthContext);
	const { updateUserBio } = useUpdateProfile();

	/**
	 * Handles updating the users bio
	 */
	const handleSubmitBioUpdate = async () => {
		if (editedBio) {
			await updateUserBio(editedBio);
			setEditingBio(dispatchAuth, false);
			setBioState(EditorState.createWithContent(convertFromRaw(JSON.parse(editedBio))));
		} else {
			setEditingBio(dispatchAuth, false);
		}
	};

	return <Button text="Save" color="btn-success" icon="save" onClick={handleSubmitBioUpdate} size="w-fit" />;
}

export default SaveBioBtn;
