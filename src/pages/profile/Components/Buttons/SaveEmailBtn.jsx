import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setEditingEmail } from '../../../../context/auth/AuthActions';
import { useUpdateProfile } from '../../../../context/auth/AuthActions';
import { checkMatchingEmails } from '../../../../context/auth/AuthUtils';
import { toast } from 'react-toastify';
import errorReport from '../../../../utilities/errorReport';

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
				errorReport('No email', false, 'handleSubmitEmailUpdate');
				toast.error('You forgot an email!');
				return;
			}

			if (!checkMatchingEmails(editingEmail, verifyEditedEmail)) {
				errorReport("Emails don't match!", false, 'handleSubmitEmailUpdate');
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
