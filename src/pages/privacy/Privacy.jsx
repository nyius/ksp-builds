import React, { useEffect } from 'react';
import useResetStates from '../../utilities/useResetStates';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import AstroBiff from '../../assets/astrobiff-balloon.png';
import Helmet from '../../components/Helmet/Helmet';

/**
 * Privacy Policy Page
 * @returns
 */
function Privacy() {
	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Privacy Policy" pageLink="https://kspbuilds.com/privacy" />

			<MiddleContainer>
				<PlanetHeader text="Privacy Policy" />

				<p className="text-lg 2k:text-3xl text-slate-200">
					We at Kerbal Builds respect the privacy of our users and are committed to protecting it. <br></br>
					<br></br> This privacy policy explains how we collect, use, and disclose information about our users. <br></br>
					<br></br> Information We Collect We collect two types of information from our users: personal information and non-personal information. <br></br> &emsp;•Personal information is information that identifies you as an individual,
					such as your name and email address. <br></br>
					&emsp;•Non-personal information is information that does not identify you as an individual, such as the type of browser you are using. <br></br>
					<br></br>We collect personal information when you register for an account on our website. <br></br>
					We only collect the minimum amount of personal information required to provide you with the services on our website. How We Use Your Information We use your personal information to create and maintain your account on our website,
					to provide you with customer support, and to communicate with you about your account and our services. <br></br>We may also use your email address to send you promotional emails about our website, but only if you have opted in to
					receive them. We do not sell, rent, or share your personal information with third parties, except as necessary to provide our services or as required by law. <br></br>
					<br></br>How We Protect Your Information We use reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no data transmission over the internet can be
					guaranteed to be 100% secure, so we cannot guarantee the security of your information. Your Choices You can access and update your personal information by logging in to your account on our website. <br></br>
					<br></br>You can also opt out of receiving promotional emails on your settings page.<br></br>
					<br></br> Changes to Our Privacy Policy We may update our privacy policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website. <br></br>
				</p>
				<div className="w-96">
					<img src={AstroBiff} alt="" />
				</div>
			</MiddleContainer>
		</>
	);
}

export default Privacy;
