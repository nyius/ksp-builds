import React from 'react';
//---------------------------------------------------------------------------------------------------//
import MobileHamburger from './MobileHamburger';
import Notifications from '../notifications/Notifications';
import MobileTypes from './Components/MobileTypes';
import LogoBtn from './Buttons/LogoBtn';
import UploadBtn from './Buttons/UploadBtn';
import NewsBtn from './Buttons/NewsBtn';
import ChallengesBtn from './Buttons/ChallengesBtn';
import HowToUploadBtn from './Buttons/HowToUploadBtn';
import SubscribeBtn from './Buttons/SubscribeBtn';
import DiscordBtn from './Buttons/DiscordBtn';
import CheckCredentials from '../credentials/CheckCredentials';
import UserDropdown from './Components/UserDropdown';
import CreateAccountBtn from './Buttons/CreateAccountBtn';
import LoginBtn from './Buttons/LoginBtn';

/**
 * Displays the navbar
 * @returns
 */
function NavBar() {
	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="fixed z-101 flex-col mb-5 w-full bg-base-900">
			<div className="navbar">
				<div className="flex-1">
					<LogoBtn />

					{/* Mobile Hamburger */}
					<div className="flex flex-row gap-4">
						<MobileHamburger />
						<MobileTypes />
					</div>

					<ul className="menu menu-horizontal px-6 gap-3 2k:gap-6">
						<UploadBtn />
						<NewsBtn />
						<ChallengesBtn />
						<HowToUploadBtn />
						<SubscribeBtn />
					</ul>
				</div>

				<div className="flex-none gap-3">
					<DiscordBtn />
					<CheckCredentials type="user">
						<Notifications />
						<UserDropdown />
					</CheckCredentials>

					<CheckCredentials type="loggedOut">
						<CreateAccountBtn />
						<LoginBtn />
					</CheckCredentials>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
