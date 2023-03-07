import React from 'react';
import { useNavigate } from 'react-router-dom';

function UsernameLink({ username, uid }) {
	const navigate = useNavigate();
	return (
		<p id="userlink" className="text-xl 2k:text-3xl link link-hover link-accent" onClick={() => navigate(`/profile/${uid}`)}>
			{username}
		</p>
	);
}

export default UsernameLink;
