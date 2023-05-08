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
					<img src={buildOfTheWeek.thumbnail} alt={buildOfTheWeek.name} className="rounded-xl object-contain max-w-full z-50" />
					<div className="flex flex-col px-6 py-16 flex-1 relative">
						<div className="flex flex-col lg:flex-row flex-wrap lg:place-content-between mb-10 2k:mb-10">
							<div className="flex flex-row flex-wrap gap-4 2k:gap-8">
								<p className="text-2xl 2k:text-4xl text-white z-50">Build of the Week</p>
								<p className="text-3xl 2k:text-5xl text-white font-bold z-50 truncate-3">{buildOfTheWeek.name}</p>
								{/* {challenge.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official Challenge</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Challenge</p>} */}
							</div>
							<p className="text-lg 2k:text-2xl italic text-slate-500 z-50 shrink-0">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(buildOfTheWeek.dateAdded.seconds * 1000)}</p>
						</div>
						{/* <div className="flex flex-col gap-2 max-h-80 overflow-hidden challenge-fade">
									{challenge?.article.model &&
										parsedArticle.map((section, i) => {
											return (
												<p key={i} className="text-xl 2k:text-3xl">
													{section}
												</p>
											);
										})}
									{!challenge?.article.model && (
										<>
											<Editor editorState={parsedArticle} readOnly={true} toolbarHidden={true} />
										</>
									)}
								</div> */}

						{/* <Button type="ahref" href={`/challenges/${challenge.articleId}`} text="Read more" color="bg-base-900 hover:!bg-primary" css="font-thin absolute bottom-2 right-2" position="z-50" size="w-fit" /> */}
					</div>
				</div>
			</div>
		);
	}

	// This is for the banner card
	if (currentSlide === i) {
		return (
			<>
				<img src={buildOfTheWeek.thumbnail} alt={buildOfTheWeek.name} className="rounded-lg object-contain h-full z-50 cursor-pointer" onClick={() => navigate(`/build/${buildOfTheWeek.id}`)} />

				<div className="flex flex-row w-full px-4 items-center">
					<div className="flex flex-col max-w-1/2">
						<div className="flex flex-row flex-wrap gap-2 2k:gap-4 mb-2 2k:mb-4">
							<p className="text-2xl 2k:text-4xl text-slate-300 z-50 font-bold flex flex-row gap-2 2k:gap-4">Build of the Week</p>
							<p className="text-3xl 2k:text-5xl text-white font-bold z-50 truncate-3">{buildOfTheWeek.name}</p>
							<div className="text-lg 2k:text-xl text-slate-400 flex flex-row gap-3 flex-wrap items-center">
								Created by
								<UsernameLink username={buildOfTheWeek.author} uid={buildOfTheWeek.uid} hoverPosition="bottom-right" />
							</div>
							{/* {challenge.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official Challenge</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Challenge</p>} */}
						</div>
						<p className="text-lg 2k:text-2xl italic text-slate-500 mb-10 2k:mb-20 z-50 shrink-0">
							{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(buildOfTheWeek.buildOfTheWeek.seconds * 1000)}
						</p>
						<div className="flex flex-row flex-wrap gap-4 2k:gap-6">
							<Button type="ahref" href={`/build/${buildOfTheWeek.id}`} text="View build" icon="right" color="btn-dark text-white" position="z-50" size="w-fit" />
						</div>
					</div>
					<div className="flex justify-center z-50">
						<img src={BotwBadge} alt="" className="w-60 xl:w-64 2k:w-72 aspect-auto" />
					</div>
				</div>
			</>
		);
	}
}

export default BuildOfTheWeekCard;
