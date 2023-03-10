import React from 'react';

import { useLocation } from 'react-router-dom';
import BuildLeftBarContent from './BuildLeftBarContent';
import IndexLeftBar from './IndexLeftBar';

function LeftBar() {
	const currentPage = useLocation();

	return (
		<div className="hidden md:block bg-base-800 rounded-xl p-4 2k:p-10 h-full fixed left-bar">
			<IndexLeftBar />
		</div>
	);
}

export default LeftBar;
