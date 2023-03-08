import React from 'react';
import LogoLight from '../../assets/logo_light_full.png';
import { useNavigate } from 'react-router-dom';

function Footer() {
	const navigate = useNavigate();

	return (
		<footer className="footer items-center p-4 bg-neutral text-neutral-content">
			<div className="items-center grid-flow-col">
				<img src={LogoLight} className="h-10 2k:h-16 btn" alt="" onClick={() => navigate('/')} />
				<p className="texg-lg 2k:text-3xl  mr:5 2k:mr-10">Copyright © 2023 Joseph Scicluna - All right reserved</p>
				<ul className="menu menu-horizontal gap-4 2k:gap-6">
					<li onClick={() => navigate('/privacy')} className="link link-accent text-lg 2k:text-2xl">
						Privacy Policy
					</li>
					<li onClick={() => navigate('/terms')} className="link link-accent text-lg 2k:text-2xl">
						Terms of Service
					</li>
				</ul>
			</div>
			<div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">KSP Builds is not affiliated with Private Division, Intercept Games, Take Two, or the Kerbal Space Program 2.</div>
		</footer>
	);
}

export default Footer;
