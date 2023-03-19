import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
	 * Checks if the user is logged in before navigating to the upload page, so we can display an erorr if they aren't
	 */
	const handleUploadNavigate = () => {
		if (!authLoading) {
			if (!user?.username) {
				toast.error('You must be signed in to upload a new build!');
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="navbar bg-base-900 mb-5 w-full fixed z-101">
			<div className="flex-1">
				{/* Logo  */}
				<Link to="/">
					<img src={Logo} className="h-10 2k:h-20 btn btn-ghost hidden sm:block" alt="KSP Builds Logo, navigate home" />
				</Link>

				{/* Mobile Hamburger */}
				<div className="flex flex-row gap-4">
					<MobileHamburger />
					<Types />
				</div>

				{/* Buttons */}
				<ul className="menu menu-horizontal px-6 gap-3 2k:gap-6">
					<Button type="ahref" href="/upload" onClick={handleUploadNavigate} color="btn-accent" css="text-white hidden md:flex" text="Upload" icon="plus" />
					<Button type="ahref" href="/news" css="text-white hidden lg:flex" text="News" icon="news" />
					<Button type="ahref" href="/contact" css="text-white hidden lg:flex" text="Contact" icon="email" />
					<Button type="ahref" href="/faq" css="text-white hidden lg:flex" text="F.A.Q" icon="help" />
					<CreateBuildAdmin />
					<Button text="How to upload" icon="info" color="text-white" css="hidden lg:flex" htmlFor="how-to-copy-build-modal" />
				</ul>

				<div className="flex flex-row items-end">
					<p className="text-2xl 2k:text-5xl text-sate-600 italic font-bold mr-4 2k:mr-8">BETA</p>
					<p className="text-xl 2k:text-3xl text-sate-600 italic">Your Hub for KSP 2</p>
				</div>
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
								<Button type="ahref" href="/profile" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="head" text="Profile" />
								<Button type="ahref" href="/favorites" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="fill-heart" text="Favorites" />
								<Button type="ahref" href="/settings" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="settings" text="Settings" />
								<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="logout" text="Logout" onClick={() => signOut()} />
							</ul>
						</div>
					</>
				)}
				{!authLoading && !user?.username && (
					<>
						<Button type="ahref" href="/sign-up" icon="plus" text="Create Account" css="hidden md:flex" />
						<Button htmlFor="login-modal" icon="login" text="login" />
					</>
				)}
			</div>
		</div>
	);
}

export default NavBar;
