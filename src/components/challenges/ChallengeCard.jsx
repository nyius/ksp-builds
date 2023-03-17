import React from 'react';
import Button from '../buttons/Button';
import { useNavigate } from 'react-router-dom';

function ChallengeCard({ challenge, i, currentSlide }) {
	const navigate = useNavigate();

	if (currentSlide === i) {
		return (
			<>
				<img src={challenge.image} alt={challenge.title} className="rounded-lg h-full z-50" />
				<div className="flex flex-col">
					<div className="flex flex-row flex-wrap gap-4 2k:gap-8">
						<p className="text-3xl 2k:text-5xl text-white font-bold z-50">{challenge.title}</p>
						{i === 0 && <p className="badge badge-secondary text-xl 2k:text-2xl p-4">New!</p>}
					</div>
					<p className="text-lg 2k:text-2xl italic text-slate-500 mb-10 2k:mb-20 z-50">{challenge.date}</p>
					<Button onClick={() => navigate(`/challenge/${challenge.articleId}`)} text="Read more" icon="right" color="btn-primary" position="z-50" size="w-fit" />
				</div>
			</>
		);
	}
}

export default ChallengeCard;
