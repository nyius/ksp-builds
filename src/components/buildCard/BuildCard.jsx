import React from 'react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

function BuildCard({ build }) {
	const navigate = useNavigate();

	return (
		<div className="card card-compact w-96 bg-base-400 shadow-xl cursor-pointer hover:bg-base-200 hover:skew-y-1 transition-all" onClick={() => navigate(`/build/${build.id}`)}>
			<figure>
				<img src={build.image} alt="Shoes" />
			</figure>
			<div class="card-body">
				<div className="flex flex-row place-content-between">
					<h2 class="card-title text-white">{build.name}</h2>
					<h3 className="text-slate-400">{build.kspVersion}</h3>
				</div>
				<p className="truncate">{build.description}</p>

				<div className="votes flex flex-row gap-6">
					<div className="flex flex-row gap-2 cursor-pointer">
						<span className="text-2xl">
							<GoArrowUp />
						</span>
						<span className="text-lg">{build.upVotes}</span>
					</div>
					<div className="flex flex-row gap-2 text-2xl cursor-pointer">
						<span className="text-2xl">
							<GoArrowDown />
						</span>
						<span className="text-lg">{build.downVotes}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BuildCard;
