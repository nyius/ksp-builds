import React from 'react';
import LogoLight from '../../assets/logo_light_full.png';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';

/**
 * Displays the footer
 * @returns
 */
function Footer() {
	const navigate = useNavigate();

	return (
		<footer className="footer items-center p-4 bg-neutral grid-flow-row xl:grid-flow-col text-neutral-content z-51 relative">
			<div className="flex flex-col gap-3 2k:gap-6">
				<div className="flex-row flex flex-wrap lg:grid-flow-col gap-5 2k:gap-10">
					<div className="flex flex-col text-center self-center">
						<img src={LogoLight} className="h-10 2k:h-16 btn" alt="" onClick={() => navigate('/')} />
						<p className="texg-lg 2k:text-2xl  mr-5 2k:mr-10">Copyright © 2023 Joseph Scicluna</p>
						<p className="texg-lg 2k:text-2xl  mr-5 2k:mr-10">All right reserved</p>
					</div>
					<ul className="flex flex-col items-start">
						<span className="footer-title 2k:text-2xl">Services</span>
						<Button type="ahref" href="/contact" css="text-white" text="Contact" icon="email" />
						<Button type="ahref" href="/faq" css="text-white" text="F.A.Q" icon="help" />
						<Button type="ahref" target="blank" css="text-white" href="https://www.paypal.com/donate/?hosted_button_id=CCLY8A74UC328" text="Donate" icon="fill-heart" />
					</ul>
					<ul className="flex flex-col items-start">
						<span className="footer-title 2k:text-2xl">Company</span>
						<Button type="ahref" css="text-white" href="/patch-notes" text="KSPB Patch Notes" />
						<Button type="ahref" css="text-white" href="/challenges" text="Challenges" />
						<Button type="ahref" css="text-white" href="/news" text="News" />
						<Button type="ahref" css="text-white" href="/sponsor" text="Sponsors & Advertise" />
					</ul>
					<ul className="flex flex-col items-start">
						<span className="footer-title 2k:text-2xl">Social</span>
						<Button type="ahref" href="https://twitter.com/KSP_Builds" text="Twitter" target="_blank" css="text-white" icon="twitter" />
						<Button type="ahref" href={process.env.REACT_APP_DISCORD_INVITE} text="Discord" target="_blank" css="text-white" icon="discord" />
						<Button type="ahref" href="https://github.com/nyius/ksp-builds" css="text-white" target="_blank" text="Github" icon="github" />
					</ul>
					<ul className="flex flex-col items-start">
						<span className="footer-title 2k:text-2xl">Legal</span>
						<Button type="ahref" href="/privacy" text="Privacy Policy" />
						<Button type="ahref" href="/terms" text="Terms of Service" />
					</ul>
				</div>
			</div>
			<div className="flex flex-col gap-3 2k:gap-6 md:place-self-center md:justify-self-end items-end">
				<div className=" text-xl 2k:text-2xl">KSP Builds is not affiliated with Private Division, Intercept Games, Take Two, or Kerbal Space Program 2.</div>
				<div className="flex flex-row gap-3 2k:gap-6">
					<p className="text-xl 2k:text-2xl">Thanks to these amazing artists for their artwork!</p>
					<a href="https://www.freepik.com/author/catalyststuff" target="_blank" className="text-xl 2k:text-2xl link">
						@catalyststuff
					</a>
					<a href="https://www.freepik.com/author/upklyak" target="_blank" className="text-xl 2k:text-2xl link">
						@upklyak
					</a>
					<a href="https://www.freepik.com/author/brgfx" target="_blank" className="text-xl 2k:text-2xl link">
						@brgfx
					</a>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
