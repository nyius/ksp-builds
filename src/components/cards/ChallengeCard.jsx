import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
//---------------------------------------------------------------------------------------------------//
import Button from '../buttons/Button';
import useFilters from '../../context/filters/FiltersActions';

function ChallengeCard({ challenge, i, currentSlide }) {
	const { setChallengeFilter } = useFilters();
	const navigate = useNavigate();
	const [parsedArticle, setParsedArticle] = useState(null);

	useEffect(() => {
		if (challenge) {
			if (challenge.article.model) {
				setParsedArticle(findAllByKey(challenge.article.model.article.richText.json, 'value'));
			} else {
				setParsedArticle(EditorState.createWithContent(convertFromRaw(JSON.parse(challenge.article))));
			}
		}
	}, []);

	const findAllByKey = (obj, keyToFind) => {
		return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind ? acc.concat(value) : typeof value === 'object' ? acc.concat(findAllByKey(value, keyToFind)) : acc), []);
	};

	if (currentSlide === undefined) {
		return (
			<>
				{parsedArticle && (
					<div className="flex w-full p-5">
						<div className="flex flex-col lg:flex-row bg-base-900 w-full rounded-xl gap-4 lg:h-102">
							<img src={challenge.image} alt={challenge.title} className="rounded-xl object-contain max-w-full z-50" />
							<div className="flex flex-col px-6 py-16 flex-1 relative">
								<div className="flex flex-col lg:flex-row flex-wrap lg:place-content-between mb-10 2k:mb-10">
									<div className="flex flex-row flex-wrap gap-4 2k:gap-8">
										<p className="text-3xl 2k:text-5xl text-white font-bold z-50 truncate-3">{challenge.title}</p>
										{i === 0 && <p className="badge badge-secondary text-xl 2k:text-2xl p-4">New!</p>}
										{challenge.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official Challenge</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Challenge</p>}
									</div>
									<p className="text-lg 2k:text-2xl italic text-slate-500 z-50 shrink-0">{challenge.date}</p>
								</div>
								<div className="flex flex-col gap-2 max-h-80 overflow-hidden challenge-fade">
									{challenge?.article.model &&
										parsedArticle.map((section, i) => {
											return (
												<p key={i} className="text-xl 2k:text-3xl">
													{section}
												</p>
											);
										})}
									{!challenge?.article.model && (
										<>
											<Editor editorState={parsedArticle} readOnly={true} toolbarHidden={true} />
										</>
									)}
								</div>

								<Button type="ahref" href={`/challenges/${challenge.articleId}`} text="Read more" color="bg-base-900 hover:!bg-primary" css="font-thin absolute bottom-2 right-2" position="z-50" size="w-fit" />
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

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
