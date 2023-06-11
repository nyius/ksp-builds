import React, { useContext } from 'react';
import NewsContext from '../../../context/news/NewsContext';
import ChallengeCard from './ChallengeCard';

/**
 * Displays a list of challenges on the Challenge Page
 * @returns
 */
function ChallengesList() {
	const { challenges } = useContext(NewsContext);

	return (
		<>
			{challenges ? (
				<div className="flex flex-row flex-wrap">
					{challenges.map((challenge, i) => {
						return <ChallengeCard i={i} key={challenge.articleId} challenge={challenge} />;
					})}
				</div>
			) : null}
		</>
	);
}

export default ChallengesList;
