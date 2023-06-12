import React from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import { Helmet } from 'react-helmet';
import SpaceBiff2 from '../../assets/astrobiff-balloon.png';
import SpaceBiff1 from '../../assets/astrobiff-ride.png';
import Button from '../../components/buttons/Button';
import InGameLogo from '../../assets/ingame-logo.png';

/**
 * Sponsor/Advertise Page
 * @returns
 */
function Sponsor() {
	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Sponsor</title>
				<link rel="canonical" href={`https://kspbuilds.com/news`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="Sponsor" />
				<div className="flex flex-col text-slate-200 p-20 2k:p-32">
					<div className="text-3xl 2k:text-5xl text-white font-bold mb-5 2k:mb-10 text-center">KSP Builds would love to work with you!</div>
					<img src={InGameLogo} alt="In Game KSP Builds Logo" className="mb-20 2k:mb-24 rounded-xl border border-2 border-dashed border-slate-600" />
					<div className="flex flex-col md:flex-row gap-4 2k:gap-8 items-center mb-20 2k:mb-24 bg-base-800 p-8 2k:p-16">
						<div className="text-xl 2k:text-3xl w-full md:w-1/2 2k:w-3/4">
							Thank you for considering sponsoring & advertising on KSP Builds! Our site provides a platform for players to upload and share their Kerbal Space Program 2 creations with a community of like-minded space enthusiasts. By
							sponsoring our site, you'll help us cover the costs of running the website, improve existing features, and add new ones. In return, you'll receive advertising space on our website, exposure to a dedicated audience of
							Kerbal Space Program players, and the satisfaction of supporting a valuable resource for the community.
						</div>

						<div className="w-1/2 2k:w-1/4">
							<img src={SpaceBiff1} alt="" className="" />
						</div>
					</div>
					<div className="text-xl 2k:text-3xl mb-20 2k:mb-24 p-5 rounded-xl ">
						Our website attracts a passionate and engaged audience who are interested in space exploration, engineering, and creative problem-solving. With our user-friendly interface, anyone can easily upload their creations, browse
						other player's designs, and share feedback with the community. Our site is visited by a wide range of people, including students, educators, hobbyists, and professionals, making it an excellent platform to showcase your brand.
					</div>
					<div className="flex flex-col md:flex-row gap-4 2k:gap-8 items-center mb-20 2k:mb-24 bg-base-800 p-8 2k:p-16">
						<div className="w-1/2 2k:w-1/4">
							<img src={SpaceBiff2} alt="" className="" />
						</div>
						<div className="text-xl 2k:text-3xl w-full md:w-1/2 2k:w-3/4">
							Sponsoring our website is a great way to reach a highly targeted audience of space enthusiasts, promote your brand, and support the Kerbal Space Program community. We offer various sponsorship packages to suit different
							budgets and needs. Whether you're a small business or a large corporation, we can work with you to find the right package that meets your needs and goals.
						</div>
					</div>
					<div className="text-xl 2k:text-3xl mb-20 2k:mb-24 text-center">
						By sponsoring our site, you'll be contributing to a valuable resource for the Kerbal Space Program community, helping to foster creativity, innovation, and education. We appreciate your consideration and look forward to the
						opportunity to work with you. Please contact us for more information about sponsorship opportunities.
					</div>

					<Button type="ahref" href="/contact" color="btn-primary" icon="email" text="Get in touch" />
				</div>
			</MiddleContainer>
		</>
	);
}

export default Sponsor;
