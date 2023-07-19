import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingEmail } from '../../../../context/auth/AuthActions';
import { useUpdateProfile } from '../../../../context/auth/AuthActions';
import { checkMatchingEmails } from '../../../../context/auth/AuthUtils';
import { toast } from 'react-toastify';

/**
 * Button for editing the users bio
 * @returns
 */
function SaveEmailBtn() {
	const { dispatchAuth, editingEmail, verifyEditedEmail } = useAuthContext();
	const { updateUserEmail } = useUpdateProfile();

	/**
	 * Handles updating the users bio
	 */
	const handleSubmitEmailUpdate = async () => {
		if (editingEmail !== false) {
			if (editingEmail.trim() === '') {
				console.log('No email');
				toast.error('You forgot an email!');
				return;
			}

			if (!checkMatchingEmails(editingEmail, verifyEditedEmail)) {
				console.log("Emails don't match!");
				toast.error("Emails don't match!");
				return;
			}

			await updateUserEmail();
			setEditingEmail(dispatchAuth, false);
		} else {
			setEditingEmail(dispatchAuth, false);
		}
	};

	return <Button text="Save" color="btn-success" icon="save" onClick={handleSubmitEmailUpdate} size="w-fit" />;
}

export default SaveEmailBtn;
