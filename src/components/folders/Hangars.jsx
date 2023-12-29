import React from 'react';
import HangarsNavbar from './Components/HangarsNavbar';
import RenameHangarBtn from './Buttons/RenameHangarBtn';
import DeleteHangarBtn from './Buttons/DeleteHangarBtn';
import HangarViewBtn from './Buttons/HangarViewBtn';
import ShareHangarbtn from './Buttons/ShareHangarbtn';
import CollapseHangarsBtn from './Buttons/CollapseHangarsBtn';
import HangarsList from './Components/HangarsList';
import { useSetCurrentHangarOwner } from '../../context/hangars/HangarActions';

/**
 * handles displaying a users hangars
 * @returns
 */
function Hangars() {
	useSetCurrentHangarOwner();

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 w-full rounded-xl p-6 2k:p-8 bg-base-300 mb-10">
			<div className="flex flex-row place-content-between">
				<HangarsNavbar />

				<div className={`flex flex-row text-3xl 2k:text-4xl`}>
					<RenameHangarBtn />
					<DeleteHangarBtn />
					<HangarViewBtn />
					<ShareHangarbtn />
					<CollapseHangarsBtn />
				</div>
			</div>

			<div className="w-full h-1 border-b-2 border-dashed border-slate-600"></div>

			<HangarsList />
		</div>
	);
}

export default Hangars;
