import React from 'react';

import { useLocation } from 'react-router-dom';
import BuildLeftBarContent from './BuildLeftBarContent';
import IndexLeftBar from './IndexLeftBar';

function LeftBar() {
	const currentPage = useLocation();

	if (currentPage.pathname.includes('build')) {
		return (
			<div className="sidebar-left hidden md:block bg-base-400 rounded-xl p-4">
				<BuildLeftBarContent />
			</div>
		);
	} else {
		return (
			<div className="sidebar-left hidden md:block bg-base-400 rounded-xl p-4">
				<IndexLeftBar />
			</div>
		);
	}
}

export default LeftBar;
