import React from 'react';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import Button from '../buttons/Button';
import useFilters from '../../context/filters/FiltersActions';
import DefaultChallengeImg from '../../assets/defaultChallenge.png';

/**
 * Displays the challenge card
 * @param {*} challenge - the challenge to display
 * @param {int} i - array index
 * @param {int} currentSlide - the current selected slide
 * @returns
 */
function ChallengeCard({ challenge, i }) {
	const { setChallengeFilter } = useFilters();
	const navigate = useNavigate();

	const date = new Date(challenge.date);

	return (
		<>
			<img src={challenge?.image ? challenge?.image : DefaultChallengeImg} alt={challenge?.title} className="rounded-lg object-contain h-full z-50 cursor-pointer" onClick={() => navigate(`/challenges/${challenge?.articleId}`)} />

			<div className="flex flex-col w-full px-4 justify-center">
				<div className="flex flex-row flex-wrap gap-2 2k:gap-4 mb-2 2k:mb-4">
					<p className="text-3xl 2k:text-5xl text-white font-bold z-50 truncate-3">{challenge?.title}</p>
					{i === 0 && <p className="badge badge-secondary text-xl 2k:text-2xl p-4">New!</p>}
					{challenge?.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official Challenge</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Challenge</p>}
				</div>
				<p className="text-lg 2k:text-2xl italic text-slate-500 mb-10 2k:mb-20 z-50 shrink-0">{date.toDateString()}</p>
				<div className="flex flex-row flex-wrap gap-4 2k:gap-6">
					<Button type="ahref" href={`/upload/challenge=${challenge?.articleId}`} text="Submit Build" icon="plus" color="btn-dark text-white" position="z-50" size="w-fit" />
					<Button type="ahref" href={`/challenges/${challenge?.articleId}`} text="Read more" icon="right" color="btn-dark text-white" position="z-50" size="w-fit" />
					<Button onClick={() => setChallengeFilter(challenge?.articleId)} text="View Builds" icon="export" color="btn-dark text-white" position="z-50" size="w-fit" />
				</div>
			</div>
		</>
	);
}

export default ChallengeCard;
