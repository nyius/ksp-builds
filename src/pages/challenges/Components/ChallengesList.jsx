import React from 'react';
import { useNewsContext } from '../../../context/news/NewsContext';
import ChallengeCard from './ChallengeCard';
import Button from '../../../components/buttons/Button';
import { useFetchMoreChallenges } from '../../../context/news/NewsActions';

/**
 * Displays a list of challenges on the Challenge Page
 * @returns
 */
function ChallengesList() {
	const { challenges, challengesLength } = useNewsContext();
	const { fetchMoreChallenges } = useFetchMoreChallenges();

	return (
		<>
			{challenges ? (
				<div className="flex flex-row flex-wrap">
					{challenges.map((challenge, i) => {
						return <ChallengeCard i={i} key={challenge.articleId} challenge={challenge} />;
					})}
				</div>
			) : null}
			{challengesLength !== challenges.length ? <Button color="btn-primary" text="Load More" icon="plus" onClick={fetchMoreChallenges} /> : ''}
		</>
	);
}

export default ChallengesList;
