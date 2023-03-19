import React, { useState, useContext } from 'react';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import AuthContext from '../../context/auth/AuthContext';
import { db } from '../../firebase.config';
import { addDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import AstrobiffThink from '../../assets/astrobiff-think.png';
import { Helmet } from 'react-helmet';

/**
 * Displays the contact page
 * @returns
 */
function Contact() {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState({
		message: '',
		date: serverTimestamp(),
		username: '',
		name: '',
		email: '',
		uid: '',
		replied: false,
		type: 'contact',
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
				newFormData.uid = user.uid;
			} else {
				newFormData.username = 'Anonymous';
			}

			await addDoc(collection(db, 'reports'), newFormData);
			toast.success('Message submitted!');
			setSubmitted(true);
			setFormData({ message: '', date: serverTimestamp() });
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
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Contact</title>
				<link rel="canonical" href={`https://kspbuilds.com/contact`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="Contact" />

				{submitted ? (
					<div className="w-full flex flex-row items-center mb-20">
						<p className="text-2xl 2k:text-4xl font-bold">Message Sent!</p>
					</div>
				) : (
					<div className="flex flex-col sm:flex-row gap-5 2k:gap-10 items-center justify-center">
						<form onSubmit={handleSubmit} className="flex flex-col gap-4 2k:gap-8 2xl:max-w-4xl w-full">
							<p className="text-2xl 2k:text-4xl font-bold">Want to get in touch?</p>
							<p className="text-xl 2k:text-2xl text-slate-400 mb-3 2k:mb-6">Leave a message!</p>
							<p className="text-xl 2k:text-2xl text-slate-400 font-bold">Name (optional)</p>
							<input placeholder="Enter name" typeof="name" id="name" type="text" className="input" onChange={handleFormChange} />
							<p className="text-xl 2k:text-2xl text-slate-400 font-bold">Email (optional)</p>
							<input placeholder="Enter Email" typeof="email" id="email" type="text" className="input" onChange={handleFormChange} />
							<textarea id="message" cols="10" rows="4" className="textarea text-xl 2k:text-3xl" placeholder="Message..." onChange={handleFormChange} defaultValue={formData.message}></textarea>
							<Button text="send" type="submit" color="btn-primary" margin="mb-10" onClick={handleSubmit} />
						</form>
						<img src={AstrobiffThink} alt="AStrobiff Thinking" className="w-100 h-full" />
					</div>
				)}
			</MiddleContainer>
		</>
	);
}

export default Contact;
