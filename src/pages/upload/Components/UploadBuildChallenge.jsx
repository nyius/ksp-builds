import React, { useEffect, useState } from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload, useGetBuildChallenge } from '../../../context/build/BuildActions';
import { useNewsContext } from '../../../context/news/NewsContext';
import Select from '../../../components/selects/Select';

/**
 * Input the field for the builds challenge
 * @returns
 */
function UploadBuildChallenge() {
	const { dispatchBuild, buildToUpload } = useBuildContext();
	const { challenges, articlesLoading } = useNewsContext();
	// const [challengeParam] = useGetBuildChallenge(null);

	/**
	 * Handles setting the KSP version
	 * @param {*} e
	 */
	const setChallenge = e => {
		const challenge = challenges.filter(challenge => {
			if (challenge.articleId === e.target.id) return challenge;
		});

		setBuildToUpload(dispatchBuild, { ...buildToUpload, forChallenge: e.target.id === 'none' ? false : e.target.id, challengeTitle: challenge.length > 0 ? challenge[0].title : null });
	};

	const { SelectBox, Option } = Select(
		setChallenge,
		{
			id: buildToUpload?.forChallenge,
			text: buildToUpload?.challengeTitle,
		},
		true
	);

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">Weekly Challenge</p>
				<SelectBox selectText="Challenge:" size="w-[20rem] 2k:w-[40rem]">
					<Option id="none" displayText={'None'} />
					{!articlesLoading &&
						challenges.map((challenge, i) => {
							return <Option key={i} id={challenge.articleId} displayText={challenge.title.length > 40 ? challenge.title.slice(0, 41) + '...' : challenge.title} />;
						})}
				</SelectBox>
			</div>
		);
	}
}

export default UploadBuildChallenge;
