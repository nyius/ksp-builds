import React from 'react';
import Button from '../buttons/Button';

function ChallengeCard({ challenge, i, currentSlide }) {
	if (currentSlide === i) {
		return (
			<>
				<img src={challenge.image} alt={challenge.title} className="rounded-lg h-full z-50" />
				<div className="flex flex-col">
					<p className="text-3xl 2k:text-5xl text-white font-bold z-50">{challenge.title}</p>
					<p className="text-lg 2k:text-2xl italic text-slate-500 mb-10 2k:mb-20 z-50">{challenge.date}</p>
					<Button type="ahref" target="_blank" href={challenge.url} text="Read more" icon="right" color="btn-primary" position="z-50" />
				</div>
			</>
		);
	}
}

export default ChallengeCard;
