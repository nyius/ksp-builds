import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.config';
import { toast } from 'react-toastify';
//---------------------------------------------------------------------------------------------------//
import CreateBuildAdmin from '../buttons/CreateBuildAdmin';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
//---------------------------------------------------------------------------------------------------//
import Logo from '../../assets/logo_light_full.png';
import Button from '../buttons/Button';
import LogoIcon from '../../assets/logo_light_icon.png';
import MobileHamburger from './MobileHamburger';
import Notifications from './Notifications';
import Types from '../types/Types';

function NavBar() {
	const { user, dispatchAuth, authLoading } = useContext(AuthContext);
	const navigate = useNavigate();

	/**
	 * Function to handle signing out
	 */
	const signOut = () => {
		toast.success('Logged Out');
		auth.signOut();
		dispatchAuth({
			action: 'LOGOUT',
		});
	};

	/**
	 * Checks if the user is logged in before navigating to the create page, so we can display an erorr if they aren't
	 */
	const handleCreateNavigate = () => {
		if (!authLoading) {
			if (user?.username) {
				navigate('/create');
			} else {
				toast.error('You must be signed in to create a new build!');
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="navbar bg-base-900 mb-5 w-full fixed z-101">
			<div className="flex-1">
				{/* Logo  */}
				<img src={Logo} className="h-10 2k:h-20 btn btn-ghost hidden sm:block" alt="" onClick={() => navigate('/')} />

				{/* Mobile Hamburger */}
				<div className="flex flex-row gap-4">
					<MobileHamburger />
					<Types />
				</div>

				{/* Buttons */}
				<ul className="menu menu-horizontal px-6 gap-3 2k:gap-6">
					<Button onClick={handleCreateNavigate} color="btn-accent" css="text-white hidden md:flex" text="Create" icon="plus" />
					<Button onClick={() => navigate('/news')} css="text-white hidden md:flex" text="News" icon="news" />
					<Button onClick={() => navigate('/contact')} css="text-white hidden md:flex" text="Contact" icon="email" />
					<CreateBuildAdmin />
				</ul>

				<p className="text-2xl 2k:text-5xl text-sate-600 italic font-bold">BETA</p>
			</div>

			<div className="flex-none gap-3">
				{!authLoading && user?.username && (
					<>
						<Notifications />
						<div className="dropdown dropdown-end">
							<label tabIndex={0} className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
								<div className="w-10 2k:w-20 rounded-full">
									<img src={user.profilePicture ? user.profilePicture : LogoIcon} />
								</div>
							</label>
							<ul tabIndex={0} className="mt-3 p-5 2k:p-6 shadow menu dropdown-content gap-2 bg-base-500 rounded-box w-96">
								<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="head" text="Profile" onClick={() => navigate('/profile')} />
								<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="fill-heart" text="Favorites" onClick={() => navigate('/favorites')} />
								<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="settings" text="Settings" onClick={() => navigate('/settings')} />
								<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="logout" text="Logout" onClick={() => signOut()} />
							</ul>
						</div>
					</>
				)}
				{!authLoading && !user?.username && <Button htmlFor="login-modal" icon="login" text="login" />}
			</div>
		</div>
	);
}

export default NavBar;
