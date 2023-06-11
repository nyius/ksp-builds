import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import Button from '../../../components/buttons/Button';
import { toast } from 'react-toastify';
import { db } from '../../../firebase.config';
import { cloneDeep } from 'lodash';
import { addDoc, collection } from 'firebase/firestore';

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
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong, please try again');
		}
	};

	return <Button text="send" type="submit" color="btn-primary" margin="mb-10" onClick={handleSubmit} />;
}

export default SubmitBtn;
