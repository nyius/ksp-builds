import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import findAllByKey from '../../../utilities/findAllByKey';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState } from 'draft-js';
import ReadMoreChallengebtn from './Buttons/ReadMoreChallengebtn';

/**
 * Displays a challenge Card on the Challenges Page
 * @param {obj} challenge
 * @returns
 */
function ChallengeCard({ challenge, i }) {
	const [parsedArticle, setParsedArticle] = useState(null);

	useEffect(() => {
		if (challenge) {
			if (challenge.article.model.article) {
				setParsedArticle(findAllByKey(challenge.article.model.article.richText.json, 'value'));
			} else {
				if (typeof challenge.article !== 'object') {
					setParsedArticle(EditorState.createWithContent(convertFromRaw(JSON.parse(challenge.article))));
				}
			}
		}
	}, []);

	if (parsedArticle) {
		return (
			<Link to={`/challenges/${challenge.articleId}`} className="flex w-full p-4 hover:bg-primary rounded-xl cursor-pointer">
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
							{challenge?.article.model
								? parsedArticle.map((section, i) => {
										return (
											<p key={i} className="text-xl 2k:text-3xl">
												{section}
											</p>
										);
								  })
								: null}
							{!challenge?.article.model ? (
								<div>
									<Editor editorState={parsedArticle} readOnly={true} toolbarHidden={true} />
								</div>
							) : null}
						</div>

						<ReadMoreChallengebtn challengeId={challenge.articleId} />
					</div>
				</div>
			</Link>
		);
	} else {
		return null;
	}
}

export default ChallengeCard;
