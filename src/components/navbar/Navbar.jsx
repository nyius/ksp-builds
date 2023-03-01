import React from 'react';
import GoogleSignIn from '../buttons/google/GoogleSignIn';
import Logo from '../../assets/logo_light_full.png';

function NavBar() {
	return (
		<div className="navbar bg-base-300">
			<div className="flex-1">
				<img src={Logo} className="h-10 btn" alt="" />
			</div>
			<div className="flex-none gap-2">
				<div className="form-control">
					<input type="text" placeholder="Search" className="input input-bordered" />
				</div>
				<div className="dropdown dropdown-end">
					<label tabIndex={0} className="btn btn-circle avatar">
						<div className="w-10 rounded-full">
							<img src="https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/logo_light_icon.png?alt=media&token=bbcff4bd-de9e-4d39-b77e-7046f90ed832" />
						</div>
					</label>
					<ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
						<li>
							<a className="justify-between">
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li>
							<a>Settings</a>
						</li>
						<li>
							<a>Sign in</a>
						</li>
						<li>
							<GoogleSignIn />
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
