import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';

function MobileHamburger() {
	const navigate = useNavigate();
	const { authLoading, user } = useContext(AuthContext);

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
		<div className="dropdown">
			<label tabIndex={1} className="btn btn-square btn-ghost sm:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</label>
			<ul tabIndex={1} className="mt-3 p-2 gap-2 shadow menu menu-compact dropdown-content bg-base-500 rounded-box w-96">
				<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="home" text="Home" onClick={() => navigate('/')} />
				<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="plus" text="Create" onClick={handleCreateNavigate} />
				<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text="News" icon="news" onClick={() => navigate('/news')} />
				<Button color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text="Contact" icon="email" onClick={() => navigate('/contact')} />
			</ul>
		</div>
	);
}

export default MobileHamburger;
