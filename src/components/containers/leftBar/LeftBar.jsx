import React from 'react';

import { useLocation } from 'react-router-dom';
import BuildLeftBarContent from './BuildLeftBarContent';
import IndexLeftBar from './IndexLeftBar';

function LeftBar() {
	const currentPage = useLocation();

	return (
		<div className="hidden md:block sidebar-left bg-base-400 rounded-xl p-4 2k:p-10">
			{/* {currentPage.pathname.includes('build') && <BuildLeftBarContent />} */}
			{/* {currentPage.pathname === '/' && <IndexLeftBar />} */}
			<IndexLeftBar />
		</div>
	);
}

export default LeftBar;
