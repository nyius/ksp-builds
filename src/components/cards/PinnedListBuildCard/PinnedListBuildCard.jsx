import React, { useState } from 'react';
import BuildCardViews from './Components/BuildCardViews';
import BuildCardComments from './Components/BuildCardComments';
import BuildCardDownloads from './Components/BuildCardDownloads';
import BuildCardUploadDate from './Components/BuildCardUploadDate';
import BuildCardName from './Components/BuildCardName';
import BuildCardImage from './Components/BuildCardImage';

/**
 * Displays a build card in list form
 * @param {obj} build - the build to display
 * @returns
 */
function PinnedListBuildCard({ build }) {
	const [hover, setHover] = useState(false);

	return (
		<a
			href={`/build/${build.urlName}`}
			className="flex flex-row items-center gap-4 2k:gap-6 w-full bg-base-500 hover:border-2 border-solid border-primary cursor-pointer h-fit rounded-lg p-2 hover:shadow-lg relative"
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<BuildCardImage build={build} />
			<div className="flex flex-col gap-3 2k:gap-4 w-full h-full">
				<BuildCardName name={build.name} />

				<div className="flex flex-row flex-wrap gap-2 2k:gap-4">
					<BuildCardUploadDate build={build} />
					{/* <BuildCardTypes types={build.types} /> */}
				</div>

				<div className="flex flex-row gap-8 2k:gap-12 flex-wrap">
					<BuildCardViews views={build.views} />
					<BuildCardComments commentCount={build.commentCount} />
					<BuildCardDownloads downloads={build.downloads} />
				</div>
			</div>
		</a>
	);
}

export default PinnedListBuildCard;
