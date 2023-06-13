import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuildContext from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import NewsContext from '../../../context/news/NewsContext';

/**
 * Input the field for the builds challenge
 * @returns
 */
function UploadBuildChallenge() {
	const params = useParams().id;
	const { dispatchBuild, buildToUpload } = useContext(BuildContext);
	const { challenges, articlesLoading } = useContext(NewsContext);
	const [challengeParam, setChallengeParam] = useState(null);

	/**
	 * Handles setting the KSP version
	 * @param {*} e
	 */
	const setChallenge = e => {
		const challenge = challenges.filter(challenge => {
			if (challenge.articleId === e.target.value) return challenge;
		});

		setBuildToUpload(dispatchBuild, { ...buildToUpload, forChallenge: e.target.value === 'none' ? false : e.target.value, challengeTitle: challenge.length > 0 ? challenge[0].title : null });
	};

	useEffect(() => {
		// Check if the user came here from clicking a 'submit build for ___ challenge' button.
		if (params) {
			if (!articlesLoading && params.includes('c=')) {
				const paramsSplit = params.slice(2, params.length);
				const challenge = challenges.filter(challenge => {
					if (challenge.articleId === paramsSplit) return challenge;
				});
				setBuildToUpload(dispatchBuild, { ...buildToUpload, forChallenge: paramsSplit, challengeTitle: challenge[0].title });
				setChallengeParam(paramsSplit);
			}
		}
	}, [articlesLoading]);

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">Weekly Challenge</p>
				<select onChange={setChallenge} className="select select-bordered 2k:select-lg 2k:text-2xl max-w-xs">
					<optgroup>
						<option value="none">None</option>
						{!articlesLoading &&
							challenges.map((challenge, i) => {
								return (
									<option key={i} selected={(params && challengeParam === challenge.articleId) || (buildToUpload && buildToUpload.forChallenge === challenge.articleId && true)} value={challenge.articleId}>
										{challenge.title.length > 40 ? challenge.title.slice(0, 41) + '...' : challenge.title}
									</option>
								);
							})}
					</optgroup>
				</select>
			</div>
		);
	}
}

export default UploadBuildChallenge;
