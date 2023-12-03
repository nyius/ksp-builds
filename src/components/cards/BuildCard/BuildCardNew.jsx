import React, { useEffect, useState } from 'react';
import VoteArrows from '../../buttons/VoteArrows';
import UsernameLink from '../../username/UsernameLink';
import Favorite from '../../buttons/Favorite';
//---------------------------------------------------------------------------------------------------//
import BuildCardViews from './Components/BuildCardViews';
import BuildCardImage from './Components/BuildCardImage';
import BuildCardUploadDate from './Components/BuildCardUploadDate';
import BuildCardVersion from './Components/BuildCardVersion';
import BuildCardVersionNew from './Components/BuildCardVersionNew';
import BuildCardMods from './Components/BuildCardMods';
import BuildCardModsNew from './Components/BuildCardModsNew';
import BuildCardChallenge from './Components/BuildCardChallenge';
import BuildCardDesc from './Components/BuildCardDesc';
import ExportBuildBtn from '../../buttons/ExportBuildBtn';
import ExportBuildBtnNew from '../../buttons/ExportBuildBtnNew';
import BuildCardComments from './Components/BuildCardComments';
import BuildCardDownloads from './Components/BuildCardDownloads';
import BuildCardTypes from './Components/BuildCardTypes';
import BuildCardName from './Components/BuildCardName';
import BuildCardContainer from './Components/BuildCardContainer';
import BuildCardContainerNew from './Components/BuildCardContainerNew';

/**
 * Displays a builds card
 * @param {obj} build - the build to display
 * @returns
 */
function BuildCard({ build }) {
	const [hover, setHover] = useState(false);
	const [hoverAnim, setHoverAnim] = useState(false);

	//---------------------------------------------------------------------------------------------------//
	return (
		<BuildCardContainerNew build={build} setHover={setHover} setHoverAnim={setHoverAnim}>
			<div className="card card-compact card-sizing grow bg-base-400 cursor-pointer w-full absolute top-0 right-0 left-0 bottom-0">
				<a href={`/build/${build.urlName}`} className="flex flex-col buildCardHover w-full">
					<figure className="bg-base-900 relative">
						<BuildCardViews views={build.views} />
						<BuildCardImage build={build} />
					</figure>

					<div className="flex flex-col w-full p-4 2k:p-6 place-content-between">
						<div className="flex flex-col gap-2 w-full">
							<BuildCardName name={build.name} />

							<div className="flex flex-row flex-wrap place-content-between mb-2 2k:mb-4">
								<UsernameLink hoverPosition="top" username={build.author} uid={build.uid} />
								<BuildCardUploadDate timestamp={build.timestamp} />
							</div>

							<div className="flex transition-all flex-row gap-4 2k:gap-6 mb-3 2k:mb-6">
								<BuildCardVersionNew version={build.kspVersion} />
								<BuildCardModsNew modsUsed={build.modsUsed} />
							</div>

							<div className="divider mt-1 mb-2"></div>

							<BuildCardTypes types={build.types} />
						</div>
					</div>
				</a>

				<div className={`flex flex-row flex-wrap absolute ${hover === build.urlName ? 'bottom-12 2k:bottom-14 ' : 'bottom-0'} z-50 transition-all left-0 bg-base-800 w-full px-2 xl:px-4`}>
					<div className="flex flex-row place-content-between w-full flex-wrap gap-2 items-center">
						<VoteArrows build={build} />
						<BuildCardComments commentCount={build.commentCount} />
						<BuildCardDownloads downloads={build.downloads} />
						<Favorite id={build.id} />
					</div>
				</div>

				<ExportBuildBtnNew id={build.id} />
			</div>
		</BuildCardContainerNew>
	);
}

export default BuildCard;
