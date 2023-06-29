import React, { useState } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import { serverTimestamp } from 'firebase/firestore';
import AstrobiffThink from '../../assets/astrobiff-think.png';
import Helmet from '../../components/Helmet/Helmet';
import SubmitBtn from './Components/SubmitBtn';

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

	/**
	 * handles setting the state when the form changes
	 * @param {event} e
	 */
	const handleFormChange = e => {
		setFormData(prevState => {
			return {
				...prevState,
				[e.target.id]: e.target.value,
			};
		});
	};

	if (submitted) {
		return (
			<MiddleContainer>
				<div className="w-full flex flex-col items-center mb-20 text-white my-10 gap-5">
					<p className="text-2xl 2k:text-4xl font-bold">Message Sent!</p>
					<p className="text-xl 2k:text-2xl font-bold">We'll reply as fast as we can.</p>
				</div>
			</MiddleContainer>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Contact" pageLink="https://kspbuilds.com/contact" description="Contact page for KSP Builds. Submit bugs, ask a question, share ideas, or simply reach out for a conversation!" />

			<MiddleContainer>
				<PlanetHeader text="Contact" />

				<div className="flex flex-col sm:flex-row gap-5 2k:gap-10 items-center justify-center">
					<form className="flex flex-col gap-4 2k:gap-8 2xl:max-w-4xl w-full">
						<p className="text-2xl 2k:text-4xl font-bold">Want to get in touch?</p>
						<p className="text-xl 2k:text-2xl text-slate-400 mb-3 2k:mb-6">Leave a message!</p>
						<p className="text-xl 2k:text-2xl text-slate-400 font-bold">Name (optional)</p>
						<input placeholder="Enter name" typeof="name" id="name" type="text" className="input" onChange={handleFormChange} />
						<p className="text-xl 2k:text-2xl text-slate-400 font-bold">Email (optional)</p>
						<input placeholder="Enter Email" typeof="email" id="email" type="text" className="input" onChange={handleFormChange} />
						<textarea id="message" cols="10" rows="4" className="textarea text-xl 2k:text-3xl" placeholder="Message..." onChange={handleFormChange} defaultValue={formData.message}></textarea>
						<SubmitBtn formData={formData} setSubmitted={setSubmitted} />
					</form>
					<img src={AstrobiffThink} alt="AStrobiff Thinking" className="w-100 h-full" />
				</div>
			</MiddleContainer>
		</>
	);
}

export default Contact;
