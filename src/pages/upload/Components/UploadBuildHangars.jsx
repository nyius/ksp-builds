import React from 'react';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import Builds from '../../../components/builds/Builds';
import Hangars from '../../../components/folders/Hangars';
import WhatIsHangarBtn from './Buttons/WhatIsHangarBtn';
import { useGetFilteredBuilds } from '../../../context/builds/BuildsActions';

/**
 * Displays the users hangars
 * @returns
 */
function UploadBuildHangars() {
	const { openedHangar } = useHangarContext();
	const [sortedBuilds] = useGetFilteredBuilds(null);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col w-full gap-2 2k:gap-4">
			<div className="flex flex-row gap-4 items-center mb-2 2k:mb-4 mt-8 2k:mt-18">
				<h3 className="flex flex-row gap-2 items-center 2k:gap-4 text-slate-200 text-xl 2k:text-3xl">
					Save to Hangar{' '}
					<span>
						<WhatIsHangarBtn />
					</span>
				</h3>
			</div>
			<Hangars />

			{openedHangar ? <Builds buildsToDisplay={sortedBuilds} /> : null}
		</div>
	);
}

export default UploadBuildHangars;
