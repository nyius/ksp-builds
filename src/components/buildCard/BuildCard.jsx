import React, { useContext } from 'react';
import { BiComment } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import DeleteBuildAdmin from '../buttons/DeleteBuildAdmin';
import TypeBadge from '../typeBadge/TypeBadge';
import VoteArrows from '../buttons/VoteArrows';
import { AiFillEye } from 'react-icons/ai';

function BuildCard({ build }) {
	const navigate = useNavigate();
	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(build.timestamp.seconds * 1000);

	/**
	 * Handles navigating to a new page. Only navigates when we aren't clicked on an upvote/downvote arrow
	 * @param {*} e
	 */
	const handleNavigate = e => {
		if (e.target.id !== 'upVote' && e.target.id !== 'downVote' && e.target.parentElement.id !== 'upVote' && e.target.parentElement.id !== 'downVote') navigate(`/build/${build.id}`);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="card card-compact w-full bg-base-400 shadow-lg hover:shadow-xl cursor-pointer h-104">
			<DeleteBuildAdmin style="circle" id={build.id} />

			<div className="flex flex-col h-full place-content-between rounded-2xl hover:bg-zinc-900 hover:rounded-2xl" onClick={handleNavigate}>
				<figure className="bg-base-900">
					<div className="flex relative w-full items-center justify-center">
						<p className="flex flex-row gap-2 p-3 text-white badge absolute bottom-1 right-1 text-lg">
							<AiFillEye /> {build.views}
						</p>
						<img src={build.image} alt={build.name} />
					</div>
				</figure>
				<div className="card-body place-content-between">
					<div className="flex flex-row place-content-between">
						<h2 className="card-title text-white">{build.name}</h2>
						<h3 className="text-slate-400">{build.kspVersion}</h3>
					</div>
					<p className="multi-line-truncate max-h-10 mb-4">{build.description}</p>

					<div className="flex flex-row flex-wrap gap-2">
						{build.type.map((type, i) => {
							return <TypeBadge key={i} type={type} />;
						})}
					</div>

					<div className="flex flex-row flex-wrap place-content-between items-end mt-4">
						<div className="votes flex flex-row gap-8">
							<VoteArrows build={build} />
							<div className="flex flex-row items-end gap-2">
								<span className="text-2xl">
									<BiComment />
								</span>
								<span className="text-lg">{build.commentCount}</span>
							</div>
						</div>
						<h3 className="text-slate-400">{date}</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
