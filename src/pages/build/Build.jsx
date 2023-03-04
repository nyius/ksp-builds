import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import BuildContext from '../../context/build/BuildContext';
import useBuild from '../../context/build/BuildActions';
import Spinner1 from '../../components/spinners/Spinner1';
import VoteArrows from '../../components/buttons/VoteArrows';
import { AiFillEye } from 'react-icons/ai';
import TypeBadge from '../../components/typeBadge/TypeBadge';

function Build() {
	const { loadingBuild, loadedBuild } = useContext(BuildContext);
	const { fetchBuild } = useBuild();

	const { id } = useParams();

	useEffect(() => {
		fetchBuild(id);
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row bg-base-400 w-full rounded-xl p-6">
			{loadingBuild ? (
				<Spinner1 />
			) : (
				<>
					{loadedBuild ? (
						<div className="flex flex-col gap-4 w-full">
							{/* Name */}
							<h1 className="text-slate-200 text-2xl font-bold">{loadedBuild.name}</h1>

							{/* Image */}
							<div className="build-img rounded-xl w-full bg-cover bg-center bg-no-repeat bg-base-900" style={{ backgroundImage: `url('${loadedBuild.image}')` }}></div>

							<flex className="flex flex-row place-content-between">
								{/* Voting/Views */}
								<div className="flex flex-row gap-8">
									<VoteArrows build={loadedBuild} />

									<p className="flex flex-row text-2xl items-center gap-4">
										<AiFillEye />
										<span className="text-lg self-end"> {loadedBuild.views}</span>
									</p>
								</div>

								{/* Types */}
								<div className="flex flex-row flex-wrap gap-2">
									{loadedBuild.type.map((type, i) => {
										return <TypeBadge key={i} type={type} />;
									})}
								</div>
							</flex>

							{/* Description */}
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<h1 className="text-slate-200 text-2xl font-bold">Build not found! :(</h1>
							<h1 className="text-slate-200 text-xl">Check the URL to see if something was typed wrong, or maybe this build was deleted</h1>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Build;
