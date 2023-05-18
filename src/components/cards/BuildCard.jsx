import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import { BiComment } from 'react-icons/bi';
import { AiFillEye } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
//---------------------------------------------------------------------------------------------------//
import DeleteBuildAdmin from '../buttons/DeleteBuildAdmin';
import TypeBadge from '../typeBadge/TypeBadge';
import VoteArrows from '../buttons/VoteArrows';
import UsernameLink from '../buttons/UsernameLink';
import Favorite from '../buttons/Favorite';
//---------------------------------------------------------------------------------------------------//
import draftJsToPlainText from '../../utilities/draftJsToPlainText';

function BuildCard({ build }) {
	const navigate = useNavigate();
	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(build.timestamp.seconds * 1000);

	/**
	 * Handles navigating to a new page. Only navigates when we aren't clicked on an upvote/downvote arrow
	 * @param {*} e
	 */
	const handleNavigate = e => {
		if (e.target.id !== 'upVote' && e.target.id !== 'downVote' && e.target.parentElement.id !== 'upVote' && e.target.parentElement.id !== 'downVote' && e.target.id !== 'userlink') navigate(`/build/${build.urlName}`);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row  p-2 2k:p-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2k:basis-1/5 ">
			<div className="card card-compact card-sizing grow bg-base-400 shadow-lg hover:shadow-xl cursor-pointer">
				<DeleteBuildAdmin style="circle" id={build.id} userID={build.uid} />

				<div className="flex flex-col rounded-2xl buildCardHover hover:rounded-2xl w-full" onClick={handleNavigate}>
					{/* Image */}
					<figure className="bg-base-900 relative">
						{/* Views */}
						<p className="flex flex-row gap-2 p-4 2k:p-6 text-white badge absolute bottom-1 right-1 text-lg 2k:text-2xl">
							<span className="view-count">
								<AiFillEye />
							</span>
							{build.views}
						</p>

						{/* Image */}
						<div className="flex relative w-full items-center justify-center">
							<img src={build.thumbnail ? build.thumbnail : build.images[0]} alt={build.name} loading="lazy" />
						</div>
					</figure>

					{/* Body */}
					<div className="flex flex-col w-full p-4 2k:p-6 place-content-between">
						<div className="flex flex-col gap-2 w-full">
							{/* Name */}
							<h2 className="card-title text-white 2k:text-3xl mb-2 2k:mb-4">{build.name}</h2>

							<div className="flex flex-row place-content-between mb-2 2k:mb-4">
								{/* Uploaded */}
								<h3 className="text-slate-400 text-xl 2k:text-2xl sm:text-lg italic">{date}</h3>

								{/* Build Author */}
								<h3 className="flex flex-row text-slate-300 text-xl 2k:text-2xl sm:text-lg">
									<UsernameLink hoverPosition={'top-left'} username={build.author} uid={build.uid} />
								</h3>
							</div>

							<div className="flex flex-col 2k:gap-3 mb-3 2k:mb-6">
								{/* KSP Version */}
								<h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg">
									<span className="text-slate-500 italic"> ksp version:</span> {build.kspVersion}
								</h3>

								{/* Mods used */}
								<h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg">
									<span className="text-slate-500 italic"> Uses Mods:</span> {build.modsUsed ? 'Yes' : 'No'}
								</h3>

								{/* Challenge*/}
								{build.challengeTitle && (
									<h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg multi-line-truncate">
										<span className="text-slate-500 italic"> Challenge:</span> {build.challengeTitle}
									</h3>
								)}
							</div>

							{/* Description */}
							<h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg multi-line-truncate mb-4 2k:mb-8 w-full">
								<span className="text-slate-500 italic"> Description:</span> {draftJsToPlainText(build.description)}
							</h3>
						</div>
						{/* Type Badges */}
						<div className="flex flex-row flex-wrap gap-2 mb-3 2k:mb-6">
							{build.type.map((type, i) => {
								return <TypeBadge key={i} type={type} />;
							})}
						</div>
					</div>
				</div>

				{/* Voting/comments/downloads/favorite */}
				<div className="flex flex-row flex-wrap absolute bottom-0 rounded-b-xl left-0 bg-base-800 w-full p-2 xl:p-4 2k:p-4">
					<div className="flex flex-row place-content-between w-full flex-wrap gap-2 items-center">
						<VoteArrows build={build} />

						<div className="flex flex-row items-center gap-2">
							<p className="text-2xl 2k:text-4xl">
								<BiComment />
							</p>
							<p className="text-lg 2k:text-2xl">{build.commentCount}</p>
						</div>

						<div className="flex flex-row items-center gap-2">
							<p className="text-2xl 2k:text-4xl">
								<FiDownload />
							</p>
							<p className="text-lg 2k:text-2xl">{build.downloads}</p>
						</div>

						<Favorite id={build.id} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
