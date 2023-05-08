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
	const handleUploadNavigate = () => {
		if (!authLoading) {
			if (!user?.username) {
				toast.error('You must be signed in to upload a new build!');
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="dropdown">
			<label tabIndex={1} className="btn btn-square btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</label>
			<ul tabIndex={1} className="mt-3 p-2 gap-2 shadow menu menu-compact dropdown-content bg-base-500 rounded-box w-96">
				<Button type="ahref" href="/" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="home" text="Home" />
				{!authLoading && !user?.username && <Button type="ahref" href="/sign-up" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="head" text="Create Account" />}
				{!authLoading && user?.username && <Button type="ahref" href="/favorites" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="fill-heart" text="Favorites" />}
				{!authLoading && user?.username && <>{!user?.subscribed && <Button text="Subscribe" icon="outline-star" htmlFor="subscribe-modal" css="border-2 border-solid border-slate-500 space-between" color="btn-ghost" />}</>}
				<Button type="ahref" href="/upload" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="plus" text="Upload" onClick={handleUploadNavigate} />
				<Button type="ahref" href="/challenges" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text="Challenges" icon="mountain" />
				<Button type="ahref" href="/faq" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text="F.A.Q" icon="help" />
				<Button type="ahref" href="/news" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text="News" icon="news" />
				<Button type="ahref" href="/contact" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" text="Contact" icon="email" />
			</ul>
		</div>
	);
}

export default MobileHamburger;
