import React from 'react';
import { FaTwitch } from 'react-icons/fa';
import TwitchStreamList from './Components/TwitchStreamList';

/**
 * Right bar container
 * @returns
 */
function RightBar() {
	return (
		<div className="hidden xl:block">
			<div className="sidebar-right z-50 bg-base-300 border-1 border-solid border-slate-700 rounded-xl p-6 2k:p-8 h-screen overflow-auto scrollbar fixed left-bar right-1">
				<h1 className="flex flex-row items-center justify-center gap-3 text-2xl 2k:text-4xl text-slate-100 font-bold mb-6 2k:mb-8 text-center">
					Live KSP Streams
					<span>
						<FaTwitch />
					</span>
				</h1>
				<div className="h-1 w-full border-b-1 border-dashed border-slate-700"></div>

				<TwitchStreamList />
			</div>
		</div>
	);
}

export default RightBar;
