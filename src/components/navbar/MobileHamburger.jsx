import React from 'react';
import MobileBtn from './Buttons/MobileBtn';
import CheckCredentials from '../credentials/CheckCredentials';
import HamburgerBtn from './Buttons/HamburgerBtn';

function MobileHamburger() {
	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="dropdown">
			<HamburgerBtn />
			<ul tabIndex={1} className="mt-3 p-2 gap-2 shadow menu menu-compact dropdown-content bg-base-500 rounded-box w-96">
				<MobileBtn text="Home" href="/" icon="home" />
				<CheckCredentials type="loggedOut">
					<MobileBtn text="Create Account" href="/head" icon="fill-heart" />
				</CheckCredentials>
				<CheckCredentials type="user">
					<MobileBtn text="Favorites" href="/favorites" icon="fill-heart" />
				</CheckCredentials>
				<CheckCredentials type="notSubscribed">
					<MobileBtn text="Subscribe" htmlFor="subscribe-modal" icon="outline-star" />
				</CheckCredentials>
				<CheckCredentials type="admin">
					<MobileBtn text="Admin Panel" href="/admin-panel" icon="settings" />
				</CheckCredentials>
				<CheckCredentials type="moderator">
					<MobileBtn text="Accolades" href="/accolade-dashboard" icon="trophy" />
				</CheckCredentials>
				<MobileBtn text="Upload" href="/upload" icon="plus" />
				<MobileBtn text="Challenges" href="/challenges" icon="mountain" />
				<MobileBtn text="F.A.Q" href="/faq" icon="help" />
				<MobileBtn text="KSP News" href="/news" icon="news" />
				<MobileBtn text="Contact" href="/contact" icon="email" />
			</ul>
		</div>
	);
}

export default MobileHamburger;
