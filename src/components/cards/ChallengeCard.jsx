import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import Button from '../buttons/Button';
import useFilters from '../../context/filters/FiltersActions';

function ChallengeCard({ challenge, i, currentSlide }) {
	const { setChallengeFilter } = useFilters();
	const navigate = useNavigate();

	if (currentSlide === i) {
		return (
			<>
				<img src={challenge.image} alt={challenge.title} className="rounded-lg object-contain h-full z-50 cursor-pointer" onClick={() => navigate(`/challenges/${challenge.articleId}`)} />

				<div className="flex flex-col w-full px-4">
					<div className="flex flex-row flex-wrap gap-2 2k:gap-4 mb-2 2k:mb-4">
						<p className="text-3xl 2k:text-5xl text-white font-bold z-50 truncate-3">{challenge.title}</p>
						{i === 0 && <p className="badge badge-secondary text-xl 2k:text-2xl p-4">New!</p>}
						{challenge.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official Challenge</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Challenge</p>}
					</div>
					<p className="text-lg 2k:text-2xl italic text-slate-500 mb-10 2k:mb-20 z-50 shrink-0">{challenge.date}</p>
					<div className="flex flex-row flex-wrap gap-4 2k:gap-6">
						<Button type="ahref" href={`/upload/c=${challenge.articleId}`} text="Submit Build" icon="plus" color="btn-dark text-white" position="z-50" size="w-fit" />
						<Button type="ahref" href={`/challenges/${challenge.articleId}`} text="Read more" icon="right" color="btn-dark text-white" position="z-50" size="w-fit" />
						<Button onClick={() => setChallengeFilter(challenge.articleId)} text="View Builds" icon="export" color="btn-dark text-white" position="z-50" size="w-fit" />
					</div>
				</div>
			</>
		);
	}
}

export default ChallengeCard;
