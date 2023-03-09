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
		if (e.target.id !== 'upVote' && e.target.id !== 'downVote' && e.target.parentElement.id !== 'upVote' && e.target.parentElement.id !== 'downVote' && e.target.id !== 'userlink') navigate(`/build/${build.id}`);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="card card-compact w-full sm:w-96 md:w-full bg-base-400 shadow-lg hover:shadow-xl cursor-pointer h-112">
			<DeleteBuildAdmin style="circle" id={build.id} userID={build.uid} />

			<div className="flex flex-col h-full place-content-between rounded-2xl buildCardHover hover:rounded-2xl" onClick={handleNavigate}>
				<figure className="bg-base-900 relative">
					<p className="flex flex-row gap-2 p-4 2k:p-6 text-white badge absolute bottom-1 right-1 text-lg 2k:text-2xl">
						<span className="view-count">
							<AiFillEye />
						</span>
						{build.views}
					</p>
					<div className="flex relative w-full items-center justify-center">
						<img src={build.images[0]} alt={build.name} />
					</div>
				</figure>
				<div className="card-body relative">
					<div className="2k:p-4">
						{/* Name */}
						<div className="flex flex-row place-content-between mb-2 2k:mb-4">
							<h2 className="card-title text-white 2k:text-4xl">{build.name}</h2>
						</div>

						{/* Type Badges */}
						<div className="flex flex-row flex-wrap gap-2 mb-3 2k:mb-6">
							{build.type.map((type, i) => {
								return <TypeBadge key={i} type={type} />;
							})}
						</div>

						<div className="flex flex-col 2k:gap-4 mb-3 2k:mb-6">
							{/* Uploaded */}
							<h3 className="text-slate-400 text-xl 2k:text-2xl sm:text-lg">
								<span className="text-slate-500">uploaded:</span> {date}
							</h3>

							{/* Build Author */}
							<h3 className="flex flex-row text-slate-400 text-xl 2k:text-2xl sm:text-lg">
								<span className="text-slate-500 mr-2"> author:</span> <UsernameLink username={build.author} uid={build.uid} />
							</h3>

							{/* KSP Version */}
							<h3 className="text-slate-400 text-xl 2k:text-2xl sm:text-lg">
								<span className="text-slate-500"> ksp version:</span> {build.kspVersion}
							</h3>
						</div>

						{/* Description */}
						<p className="multi-line-truncate mb-14 sm:mb-4 text-xl 2k:text-2xl">{draftJsToPlainText(build.description)}</p>
					</div>
				</div>
			</div>

			{/* Voting/comments */}
			<div className="flex flex-row flex-wrap absolute bottom-0 rounded-b-xl left-0 bg-base-900 w-full p-2 2k:p-4">
				<div className="flex flex-row flex-wrap gap-8 items-center">
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
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
