import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import Button from '../../../components/buttons/Button';
import { toast } from 'react-toastify';
import { db } from '../../../firebase.config';
import { cloneDeep } from 'lodash';
import { addDoc, collection } from 'firebase/firestore';
import standardNotifications from '../../../utilities/standardNotifications';
import { sendNotification } from '../../../context/auth/AuthUtils';

/**
 * Button for submitting the submit form
 * @param {obj} formData - the form data to submit
 * @param {function} setSubmitted - the function to update a submitted state
 * @returns
 */
function SubmitBtn({ formData, setSubmitted }) {
	const { user } = useContext(AuthContext);

	/**
	 * Handles submitting a message
	 */
	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const newFormData = cloneDeep(formData);

			if (user?.username) {
				newFormData.username = user.username;
				newFormData.uid = user.uid;
			} else {
				newFormData.username = 'Anonymous';
			}

			await addDoc(collection(db, 'reports'), newFormData);
			toast.success('Message submitted!');
			setSubmitted(true);

			const newNotif = { ...standardNotifications };
			newNotif.uid = '';
			newNotif.username = '';
			newNotif.timestamp = new Date();
			newNotif.message = '{"blocks":[{"key":"87rfs","text":"New website message","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
			newNotif.type = 'message';
			delete newNotif.profilePicture;
			delete newNotif.buildId;
			delete newNotif.buildName;
			delete newNotif.comment;
			delete newNotif.commentId;

			await sendNotification('ZyVrojY9BZU5ixp09LftOd240LH3', newNotif);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong, please try again');
		}
	};

	return <Button text="send" type="submit" color="btn-primary" margin="mb-10" onClick={handleSubmit} />;
}

export default SubmitBtn;
