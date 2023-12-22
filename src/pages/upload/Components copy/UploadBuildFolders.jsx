import React from 'react';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import Builds from '../../../components/builds/Builds';
import Folders from '../../../components/folders/Folders';
import WhatIsFolderBtn from './Buttons/WhatIsFolderBtn';
import { useGetFilteredBuilds } from '../../../context/builds/BuildsActions';

/**
 * Displays the users folders
 * @returns
 */
function UploadBuildFolders() {
	const { openedFolder } = useFoldersContext();
	const [sortedBuilds] = useGetFilteredBuilds(null);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col w-full gap-2 2k:gap-4">
			<div className="flex flex-row gap-4 items-center mb-2 2k:mb-4 mt-8 2k:mt-18">
				<h3 className="flex flex-row gap-2 items-center 2k:gap-4 text-slate-200 text-xl 2k:text-3xl">
					Save to Folder{' '}
					<span>
						<WhatIsFolderBtn />
					</span>
				</h3>
			</div>
			<Folders />

			{openedFolder ? <Builds buildsToDisplay={sortedBuilds} /> : null}
		</div>
	);
}

export default UploadBuildFolders;
