import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import UsernameLink from '../buttons/UsernameLink';
//---------------------------------------------------------------------------------------------------//
import Button from '../buttons/Button';
import BotwBadge from '../../assets/BotW_badge.png';

function BuildOfTheWeekCard({ buildOfTheWeek, i, currentSlide }) {
	const navigate = useNavigate();

	// This is for the challenge page
	if (currentSlide === undefined) {
		return (
			<div className="flex w-full p-5">
				<div className="flex flex-col lg:flex-row bg-base-900 w-full rounded-xl gap-4 lg:h-102">
					<img src={buildOfTheWeek.thumbnail} alt={buildOfTheWeek.name} className="rounded-xl object-contain max-w-full z-10" />
					<div className="flex flex-col px-6 py-16 flex-1 relative">
						<div className="flex flex-col lg:flex-row flex-wrap lg:place-content-between mb-10 2k:mb-10">
							<div className="flex flex-row flex-wrap gap-4 2k:gap-8">
								<p className="text-2xl 2k:text-4xl text-white z-10 pixel-font">Build of the Week</p>
								<p className="text-3xl 2k:text-5xl text-white font-bold z-10 truncate-3">{buildOfTheWeek.name}</p>
								{/* {challenge.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official Challenge</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Challenge</p>} */}
							</div>
							<p className="text-lg 2k:text-2xl italic text-slate-500 z-10 shrink-0">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(buildOfTheWeek.dateAdded.seconds * 1000)}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// This is for the banner card
	if (currentSlide === i) {
		return (
			<>
				<div className="relative h-1/2 lg:h-full w-full lg:w-1/2">
					<img src={buildOfTheWeek.thumbnail} alt={buildOfTheWeek.name} className="relative rounded-lg object-contain w-full h-full z-10 cursor-pointer" onClick={() => navigate(`/build/${buildOfTheWeek.urlName}`)} />
					<img src={BotwBadge} alt="" className="absolute bottom-2 right-2 w-40 xl:w-50 2k:w-50 aspect-auto z-20" />
				</div>

				<div className="hidden lg:block h-full w-2 border-r-4 border-dashed border-slate-700"></div>

				<div className="flex flex-col h-full w-full lg:w-1/2 mr-5">
					<p className="text-3xl bg-primary-focus w-full justify-center h-22 mb-10 items-center 2k:text-4xl text-white px-10 z-50 flex pixel-font border-b-4 border-dashed border-slate-300">Build of the Week</p>
					<div className="flex flex-col h-full justify-center">
						<p className="pixel-font text-center text-2xl 2k:text-4xl text-white mb-6 font-bold z-50 truncate-3">{buildOfTheWeek.name}</p>

						<div className="flex flex-col w-full items-center">
							<div className="text-lg 2k:text-xl text-slate-400 flex flex-row gap-3 flex-wrap items-center">
								Created by
								<UsernameLink username={buildOfTheWeek.author} uid={buildOfTheWeek.uid} hoverPosition="bottom" />
							</div>
							<p className="text-lg mb-6 2k:mb-8 2k:text-xl italic text-slate-500 z-10">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(buildOfTheWeek.buildOfTheWeek.seconds * 1000)}</p>
							<div className="flex flex-row flex-wrap gap-4 2k:gap-6">
								<Button type="ahref" href={`/build/${buildOfTheWeek.id}`} text="View build" icon="right" color="text-white" position="z-50" />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default BuildOfTheWeekCard;
