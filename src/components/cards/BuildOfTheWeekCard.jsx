import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsernameLink from '../username/UsernameLink';
//---------------------------------------------------------------------------------------------------//
import Button from '../buttons/Button';
import BotwBadge from '../../assets/BotW_badge.png';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the card for the build of the week
 * @param {obj} buildOfTheWeek - the build of the week object
 * @returns
 */
function BuildOfTheWeekCard({ buildOfTheWeek }) {
	const navigate = useNavigate();

	// This is for the banner card
	return (
		<>
			{/* <div className="relative h-1/2 lg:h-full w-full lg:w-1/2 p-10">
				<img src={buildOfTheWeek.thumbnail} alt={buildOfTheWeek.name} className="relative rounded-lg object-contain w-full h-full z-10 cursor-pointer" onClick={() => navigate(`/build/${buildOfTheWeek.urlName}`)} />
				<img src={BotwBadge} alt="" className="absolute bottom-2 right-2 w-40 xl:w-50 2k:w-50 aspect-auto z-20" />
			</div> */}

			{/* <div className="hidden lg:block h-full w-2 border-r-4 border-dashed border-slate-700"></div> */}

			<div className="flex flex-col h-full w-full lg:w-1/2 mr-5 p-10">
				<p className="text-3xl bg-primary-focus w-full justify-center h-22 mb-10 items-center 2k:text-4xl text-white px-10 z-50 flex pixel-font border-b-4 border-dashed border-slate-300">Build of the Week</p>
				<div className="flex flex-col h-full justify-center">
					<p className="pixel-font text-center text-xl 2k:text-3xl text-slate-200 mb-6 font-bold z-50 truncate-3">{buildOfTheWeek.name}</p>

					<div className="flex flex-col w-full items-center">
						<div className="text-lg 2k:text-xl text-slate-400 flex flex-row gap-3 flex-wrap items-center">
							Created by
							<UsernameLink username={buildOfTheWeek.author} uid={buildOfTheWeek.uid} />
						</div>
						<p className="text-lg mb-6 2k:mb-8 2k:text-xl italic text-slate-500 z-10">{createDateFromFirebaseTimestamp(buildOfTheWeek.buildOfTheWeek.seconds)}</p>
						<div className="flex flex-row flex-wrap gap-4 2k:gap-6">{/* <Button type="ahref" href={`/build/${buildOfTheWeek.id}`} text="View build" icon="right" color="text-white" position="z-50" /> */}</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BuildOfTheWeekCard;
