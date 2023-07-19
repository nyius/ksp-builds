import React from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import AstroBiffComputer from '../../assets/astrobiff-computer.png';
import useResetStates from '../../hooks/useResetStates';
import Helmet from '../../components/Helmet/Helmet';

/**
 * Terms of service page
 * @returns
 */
function Terms() {
	useResetStates();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Terms and Conditions" pageLink="https://kspbuilds.com/terms" description="Terms and conditions for KSP Builds." />

			<MiddleContainer>
				<PlanetHeader text="Terms and Conditions" />
				<p className="text-xl 2k:text-3xl text-slate-300">
					Welcome to KSP Builds! These terms of service ("Terms") govern your use of our website and the services we provide. By using our website, you agree to these Terms.
					<br></br>
					<br></br>
					Your Account
					<br></br>
					You are responsible for maintaining the confidentiality of your account information, including your username and password. You are also responsible for all activities that occur under your account. You agree to notify us
					immediately of any unauthorized use of your account or any other breach of security.
					<br></br>
					<br></br>
					Your Content
					<br></br>
					You retain ownership of any content you upload to our website. However, by uploading content, you grant us a non-exclusive, royalty-free, worldwide, perpetual, and irrevocable license to use, copy, modify, distribute, and display
					the content for the purposes of providing our services.
					<br></br>
					<br></br>
					You agree not to upload any content that is illegal, infringes on the rights of others, or is otherwise objectionable. We reserve the right to remove any content that we believe violates these Terms or our policies.
					<br></br>
					<br></br>
					Our Content
					<br></br>
					Our website and the content on it, including text, graphics, logos, and images, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify,
					distribute, or display our content without our prior written consent.
					<br></br>
					<br></br>
					Our Services
					<br></br>
					We provide a platform for users to upload and share build files for the game Kerbal Space Program. We do not guarantee the accuracy, completeness, or quality of the content uploaded by users. We may modify or discontinue our
					services at any time without notice.
					<br></br>
					<br></br>
					Limitation of Liability
					<br></br>
					We are not liable for any damages arising from your use of our website or our services, including direct, indirect, incidental, consequential, or punitive damages. We are not liable for any content uploaded by users or for any
					actions taken by users. We are also not liable for any files downloaded from our website that may contain viruses or other harmful components. You are solely responsible for implementing sufficient safeguards to protect your
					computer system and data.
					<br></br>
					<br></br>
					Indemnification
					<br></br>
					You agree to indemnify and hold us harmless from any claims, damages, or expenses (including attorneys' fees) arising from your use of our website or your violation of these Terms.
					<br></br>
					<br></br>
					Governing Law
					<br></br>
					These Terms are governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
					<br></br>
					<br></br>
					Dispute Resolution
					<br></br>
					Any disputes arising from these Terms or your use of our website will be resolved through binding arbitration in accordance with the rules of the [Your Arbitration Association]. The arbitration will take place in [Your City] and
					will be conducted in English.
					<br></br>
					<br></br>
					Miscellaneous
					<br></br>
					These Terms constitute the entire agreement between you and us regarding your use of our website. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in effect. Our failure
					to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
					<br></br>
					<br></br>
				</p>

				<div className="w-96">
					<img src={AstroBiffComputer} alt="" />
				</div>
			</MiddleContainer>
		</>
	);
}

export default Terms;
