import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { auth } from '../../firebase.config';
import { toast } from 'react-toastify';
//---------------------------------------------------------------------------------------------------//
import NewGoogleAccountModal from '../modals/NewGoogleAccountModal';
import LoginModal from '../modals/LoginModal';
import CreateBuildAdmin from '../buttons/CreateBuildAdmin';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
//---------------------------------------------------------------------------------------------------//
import Logo from '../../assets/logo_light_full.png';
import LogoIcon from '../../assets/logo_light_icon.png';
import { TiPlusOutline } from 'react-icons/ti';
import SearchBar from '../search/SearchBar';

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
		<div className="navbar bg-base-300 mb-5 fixed z-101">
			<div className="flex-1">
				{/* Logo  */}
				<img src={Logo} className="h-10 btn hidden sm:block" alt="" onClick={() => navigate('/')} />

				{/* Mobile Hamburger */}
				<div className="dropdown">
					<label tabIndex={1} class="btn btn-square btn-ghost sm:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
						</svg>
					</label>
					<ul tabIndex={1} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
						<li>
							<a className=" text-2xl" onClick={handleCreateNavigate}>
								Create <TiPlusOutline />
							</a>
						</li>
					</ul>
				</div>

				<ul className="menu menu-horizontal px-6 gap-3">
					<li>
						<a onClick={handleCreateNavigate} className="btn btn-accent text-white hidden sm:flex">
							Create{' '}
							<span className="text-xl">
								<TiPlusOutline />
							</span>
						</a>
					</li>
					<li>
						<CreateBuildAdmin />
					</li>
				</ul>
			</div>

			<div className="flex-none gap-3">
				{authLoading ? (
					''
				) : (
					<>
						{user?.displayName && (
							<div className="text-3xl btn btn-circle avatar">
								<MdOutlineNotificationsNone />
							</div>
						)}
						<div className="dropdown dropdown-end">
							{user?.displayName ? (
								<>
									<label tabIndex={0} className="btn btn-circle avatar">
										<div className="w-10 rounded-full">
											<img src={user.profilePicture ? user.profilePicture : LogoIcon} />
										</div>
									</label>
									<ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
										<li>
											<a className="justify-between text-2xl md:text-lg" onClick={() => navigate('/profile')}>
												Profile
											</a>
										</li>
										<li>
											<a className="text-2xl md:text-lg">Settings</a>
										</li>
										<li onClick={() => signOut()}>
											<a className="text-2xl md:text-lg">Logout</a>
										</li>
									</ul>
								</>
							) : (
								<label htmlFor="login-modal" className="btn">
									Login
								</label>
							)}
						</div>
					</>
				)}
			</div>

			{/* ------------------ Modals ----------------- */}
			{/* Login */}
			<LoginModal />

			{/* New Google Account */}
			<NewGoogleAccountModal />
		</div>
	);
}

export default NavBar;
