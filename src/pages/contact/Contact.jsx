import React, { useState, useContext } from 'react';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import AuthContext from '../../context/auth/AuthContext';
import { db } from '../../firebase.config';
import { addDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';

function Contact() {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState({
		comment: '',
		date: serverTimestamp(),
		username: '',
	});

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
			} else {
				newFormData.username = 'Anonymous';
			}

			await addDoc(collection(db, 'reports'), newFormData);
			toast.success('Message submitted!');
			setSubmitted(true);
			setFormData({ comment: '', date: serverTimestamp() });
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong, please try again');
		}
	};

	/**
	 * handles setting the state when the form changes
	 * @param {*} e
	 */
	const handleFormChange = e => {
		setFormData(prevState => {
			return {
				...prevState,
				[e.target.id]: e.target.value,
			};
		});
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Contact" />

			{submitted ? (
				<div className="w-full flex flex-row items-center mb-20">
					<p className="text-2xl 2k:text-4xl font-bold">Message Sent!</p>
				</div>
			) : (
				<>
					<p className="text-2xl 2k:text-4xl font-bold">Want to get in touch?</p>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4 2k:gap-8 2xl:max-w-4xl">
						<p className="text-xl 2k:text-2xl text-slate-400">Leave a comment!</p>
						<textarea id="comment" cols="10" rows="4" className="textarea text-xl 2k:text-3xl" placeholder="Message..." onChange={handleFormChange} defaultValue={formData.comment}></textarea>
						<Button text="send" type="submit" color="btn-primary" margin="mb-10" onClick={handleSubmit} />
					</form>
				</>
			)}
		</MiddleContainer>
	);
}

export default Contact;
