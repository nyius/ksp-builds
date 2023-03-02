import React from 'react';
import { useNavigate } from 'react-router-dom';

function VerticalLink({ text, url }) {
	const navigate = useNavigate();
	return (
		<li onClick={() => navigate(url)}>
			<a className="text-slate-300">{text}</a>
		</li>
	);
}

export default VerticalLink;
