import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import { BiComment } from 'react-icons/bi';
import { AiFillEye } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
//---------------------------------------------------------------------------------------------------//
import { useCopyBuildToClipboard } from '../../context/build/BuildActions';
//---------------------------------------------------------------------------------------------------//
import VoteArrows from '../buttons/VoteArrows';
import UsernameLink from '../buttons/UsernameLink';
import Favorite from '../buttons/Favorite';
import Button from '../buttons/Button';
//---------------------------------------------------------------------------------------------------//
import draftJsToPlainText from '../../utilities/draftJsToPlainText';

function BuildCard({ build }) {
	const [hover, setHover] = useState(false);
	const [hoverAnim, setHoverAnim] = useState(false);
	const [fetchingRawBuild, setFetchingRawBuild] = useState(false);
	const { copyBuildToClipboard } = useCopyBuildToClipboard();

	const navigate = useNavigate();
	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(build.timestamp.seconds * 1000);

	/**
	 * Handles navigating to a new page. Only navigates when we aren't clicked on an upvote/downvote arrow
	 * @param {*} e
	 */
	const handleNavigate = e => {
		if (e.target.id !== 'upVote' && e.target.id !== 'downVote' && e.target.parentElement.id !== 'upVote' && e.target.parentElement.id !== 'downVote' && e.target.id !== 'userlink') navigate(`/build/${build.urlName}`);
	};

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
				{/* <DeleteBuildAdmin style="circle" id={build.id} userID={build.uid} /> */}

				<a href={`/build/${build.urlName}`} className="flex flex-col buildCardHover w-full">
					{/* Image */}
					<figure className="bg-base-900 relative">
						{/* Views */}
						<p className="flex flex-row gap-2 p-4 text-white badge absolute bottom-1 right-1 text-lg 2k:text-xl">
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
							<h2 className="card-title text-white build-title-truncate 2k:text-2xl mb-2 2k:mb-4 ">{build.name}</h2>

							<div className="flex flex-row flex-wrap place-content-between mb-2 2k:mb-4">
								{/* Build Author */}
								<h3 className="flex flex-row text-slate-300 text-xl 2k:text-2xl sm:text-lg">
									<UsernameLink hoverPosition="top" username={build.author} uid={build.uid} />
								</h3>

								{/* Uploaded */}
								<div className="flex items-center h-full text-slate-400 text-lg 2k:text-xl sm:text-lg italic">{date}</div>
							</div>

							<div className={`${hover === build.urlName ? 'opacity-100' : 'opacity-0'} ${hoverAnim ? 'flex' : 'hidden'} transition-all flex-col gap-3 2k:gap-5 mb-3 2k:mb-6`}>
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

								{/* Description */}
								<h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg multi-line-truncate mb-4 2k:mb-8 w-full">{draftJsToPlainText(build.description)}</h3>

								{hover === build.urlName ? (
									<Button
										color="btn-primary"
										size="w-full"
										icon="export"
										onClick={e => {
											e.preventDefault();
											copyBuildToClipboard(setFetchingRawBuild, build.id);
										}}
										text={fetchingRawBuild ? 'Copying...' : `Export to KSP 2`}
									/>
								) : null}
							</div>
						</div>
					</div>
				</a>

				{/* Voting/comments/downloads/favorite */}
				<div className="flex flex-row flex-wrap absolute bottom-0  left-0 bg-base-800 w-full px-2 xl:px-4">
					<div className="flex flex-row place-content-between w-full flex-wrap gap-2 items-center">
						<VoteArrows build={build} />

						<div className="tooltip" data-tip="Comments">
							<div className="flex flex-row items-center gap-2">
								<p className="text-2xl 2k:text-3xl">
									<BiComment />
								</p>
								<p className="text-lg 2k:text-2xl">{build.commentCount}</p>
							</div>
						</div>

						<div className="tooltip" data-tip="Downloads">
							<div className="flex flex-row items-center gap-2">
								<p className="text-2xl 2k:text-3xl">
									<FiDownload />
								</p>
								<p className="text-lg 2k:text-2xl">{build.downloads}</p>
							</div>
						</div>

						<Favorite id={build.id} />
					</div>

					{/* Build Types */}
					<div className="flex flex-row flex-wrap gap-2 mb-3 2k:mb-6 items-center">
						{build.type.map((type, i) => {
							return (
								<p className="text-lg 2k:text-xl text-slate-500" key={i}>
									{type}
									{i < build.type.length - 1 && ','}
								</p>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
