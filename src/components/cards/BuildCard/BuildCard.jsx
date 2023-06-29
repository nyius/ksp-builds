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
import BuildCardChallenge from './Components/BuildCardChallenge';
import BuildCardDesc from './Components/BuildCardDesc';
import ExportBuildBtn from '../../buttons/ExportBuildBtn';
import BuildCardComments from './Components/BuildCardComments';
import BuildCardDownloads from './Components/BuildCardDownloads';
import BuildCardTypes from './Components/BuildCardTypes';
import BuildCardName from './Components/BuildCardName';

/**
 * Displays a builds card
 * @param {obj} build - the build to display
 * @returns
 */
function BuildCard({ build }) {
	const [hover, setHover] = useState(false);
	const [hoverAnim, setHoverAnim] = useState(false);

	const handleHover = state => {
		setHoverAnim(state);

		setTimeout(() => {
			setHover(state);
		}, 100);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row p-2 2k:p-4 max-w-xl aspect-square md:aspect-5/6 shadow-lg hover:shadow-xl xl:aspect-square 2k:aspect-5/6 w-full relative" onMouseEnter={() => handleHover(build.urlName)} onMouseLeave={() => handleHover(false)}>
			<div className="card card-compact card-sizing grow bg-base-400  cursor-pointer w-full 5k:hover:w-180 4k:hover:w-170 2k:hover:w-150 xl:hover:w-130 lg:hover:w-120 hover:md:w-130 hover:aspect-3/4 hover:z-51 absolute top-0 right-0 left-0 bottom-0">
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

							<div className={`${hover === build.urlName ? 'opacity-100' : 'opacity-0'} ${hoverAnim ? 'flex' : 'hidden'} transition-all flex-col gap-3 2k:gap-5 mb-3 2k:mb-6`}>
								<BuildCardVersion version={build.kspVersion} />
								<BuildCardMods modsUsed={build.modsUsed} />
								<BuildCardChallenge challenge={build.challengeTitle} />
								<BuildCardDesc description={build.description} />
								{hover === build.urlName ? <ExportBuildBtn id={build.id} /> : null}
							</div>
						</div>
					</div>
				</a>

				<div className="flex flex-row flex-wrap absolute bottom-0  left-0 bg-base-800 w-full px-2 xl:px-4">
					<div className="flex flex-row place-content-between w-full flex-wrap gap-2 items-center">
						<VoteArrows build={build} />
						<BuildCardComments commentCount={build.commentCount} />
						<BuildCardDownloads downloads={build.downloads} />
						<Favorite id={build.id} />
					</div>

					<BuildCardTypes types={build.types} />
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
