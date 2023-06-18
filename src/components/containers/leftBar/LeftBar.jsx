import React from 'react';
import IndexLeftBar from './IndexLeftBar';

/**
 * Left bar container
 * @returns
 */
function LeftBar() {
	return (
		<div className="hidden md:block bg-base-800 rounded-xl p-4 2k:p-6 h-screen fixed left-bar z-10 overflow-auto scrollbar">
			<IndexLeftBar />
		</div>
	);
}

export default LeftBar;
