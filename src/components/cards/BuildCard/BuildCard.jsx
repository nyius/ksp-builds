import React, { useState } from 'react';
import VoteArrows from '../../buttons/VoteArrows';
import UsernameLink from '../../username/UsernameLink';
import Favorite from '../../buttons/Favorite';
//---------------------------------------------------------------------------------------------------//
import BuildCardViews from './Components/BuildCardViews';
import BuildCardImage from './Components/BuildCardImage';
import BuildCardUploadDate from './Components/BuildCardUploadDate';
import BuildCardVersion from './Components/BuildCardVersion';
import BuildCardMods from './Components/BuildCardMods';
import ExportBuildBtnNew from '../../buttons/ExportBuildBtnNew';
import BuildCardComments from './Components/BuildCardComments';
import BuildCardDownloads from './Components/BuildCardDownloads';
import BuildCardTypes from './Components/BuildCardTypes';
import BuildCardName from './Components/BuildCardName';
import BuildCardContainer from './Components/BuildCardContainer';

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
		<BuildCardContainer build={build} setHover={setHover} setHoverAnim={setHoverAnim}>
			<div className="card bg-base-300 cursor-pointer shadow-lg rounded-xl w-full">
				<a href={`/build/${build.urlName}`} className="flex flex-col h-full place-content-between buildCardHover">
					<div>
						<figure className="bg-base-700 rounded-t-xl relative">
							<BuildCardViews views={build.views} />
							<BuildCardImage build={build} />
						</figure>

						<div className="flex flex-col w-full px-7 py-5 place-content-between">
							<div className="flex flex-col gap-2 w-full">
								<BuildCardName name={build.name} />

								<div className="flex flex-col flex-wrap gap-2 place-content-between my-4">
									<UsernameLink username={build.author} uid={build.uid} />
									<BuildCardUploadDate timestamp={build.timestamp} />
								</div>

								<div className="flex transition-all flex-row place-content-between gap-4 2k:gap-6 mb-3 2k:mb-6">
									<BuildCardVersion version={build.kspVersion} />
									<BuildCardMods modsUsed={build.modsUsed} />
								</div>
							</div>
						</div>
					</div>
					<div className="mb-16 px-7">
						<div className="w-full mb-3 h-1 border-b-1 border-dashed border-slate-600"></div>

						<BuildCardTypes types={build.types} />
					</div>
				</a>

				<div className={`flex flex-row flex-wrap absolute ${hover === build.urlName ? 'bottom-14' : 'bottom-0'} items-center justify-center z-50 transition-all left-0 bg-base-600 w-full px-2 xl:px-4`}>
					<div className="flex flex-row place-content-between w-full flex-wrap gap-2 py-3 h-full items-center">
						<VoteArrows build={build} />
						<BuildCardComments commentCount={build.commentCount} />
						<BuildCardDownloads downloads={build.downloads} />
						<Favorite id={build.id} />
					</div>
				</div>

				<ExportBuildBtnNew build={build} hover={hover} />
			</div>
		</BuildCardContainer>
	);
}

export default BuildCard;
