import React from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function UsernameLink({ username, uid }) {
	const navigate = useNavigate();
	return (
		<>
			{username === 'nyius' ? (
				<div className="tooltip z-50" data-tip="Founder">
					<p id="userlink" className={`text-xl 2k:text-3xl link link-hover ${username === 'nyius' ? 'link-secondary' : 'link-accent'} flex flex-row gap-2 itms-center`} onClick={() => navigate(`/profile/${uid}`)}>
						{username}
						{username === 'nyius' && <BsFillPatchCheckFill />}
					</p>
				</div>
			) : (
				<p id="userlink" className={`text-xl 2k:text-3xl link link-hover ${username === 'nyius' ? 'link-secondary' : 'link-accent'} flex flex-row gap-2 itms-center`} onClick={() => navigate(`/profile/${uid}`)}>
					{username}
					{username === 'nyius' && <BsFillPatchCheckFill />}
				</p>
			)}
		</>
	);
}

export default UsernameLink;
