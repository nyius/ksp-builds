import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload, useGetBuildChallenge } from '../../../context/build/BuildActions';
import { useNewsContext } from '../../../context/news/NewsContext';

/**
 * Input the field for the builds challenge
 * @returns
 */
function UploadBuildChallenge() {
	const { dispatchBuild, buildToUpload } = useBuildContext();
	const { challenges, articlesLoading } = useNewsContext();
	const [challengeParam] = useGetBuildChallenge(null);

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

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">Weekly Challenge</p>
				<select value={challengeParam ? challengeParam : buildToUpload.forChallenge} onChange={setChallenge} className="select select-bordered 2k:select-lg 2k:text-2xl max-w-xs">
					<option value="none">None</option>
					{!articlesLoading &&
						challenges.map((challenge, i) => {
							return (
								<option key={i} value={challenge.articleId}>
									{challenge.title.length > 40 ? challenge.title.slice(0, 41) + '...' : challenge.title}
								</option>
							);
						})}
				</select>
			</div>
		);
	}
}

export default UploadBuildChallenge;
