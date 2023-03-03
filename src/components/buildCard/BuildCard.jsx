import React from 'react';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import { BiComment } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import DeleteBuildAdmin from '../buttons/DeleteBuildAdmin';
import TypeBadge from '../typeBadge/TypeBadge';

function BuildCard({ build, i }) {
	const navigate = useNavigate();
	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(build.timestamp.seconds * 1000);

	return (
		<div key={i} className="card card-compact w-96 bg-base-400 shadow-lg hover:shadow-xl cursor-pointer">
			<DeleteBuildAdmin style="circle" id={build.id} />
			<TypeBadge type={build.type} />

			<div className="flex flex-col h-full place-content-between rounded-2xl hover:bg-zinc-900 hover:rounded-2xl" onClick={() => navigate(`/build/${build.id}`)}>
				<figure className="bg-base-900">
					<img src={build.image} alt={build.name} />
				</figure>
				<div className="card-body">
					<div className="flex flex-row place-content-between">
						<h2 className="card-title text-white">{build.name}</h2>
						<h3 className="text-slate-400">{build.kspVersion}</h3>
					</div>
					<p className="tr-uncate">{build.description}</p>

					<div className="flex flex-row place-content-between items-end mt-4">
						<div className="votes flex flex-row gap-8">
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
							<div className="flex flex-row gap-2">
								<span className="text-2xl">
									<BiComment />
								</span>
								<span className="text-lg">{build.comments}</span>
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
