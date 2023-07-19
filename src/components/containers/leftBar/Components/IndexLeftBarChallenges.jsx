import React from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';
import { useNewsContext } from '../../../../context/news/NewsContext';

/**
 * Displays the challenges filter for the index left bar
 * @returns
 */
function IndexLeftBarChallenges() {
	const { setChallengeFilter } = useFilters();
	const { articlesLoading, challenges } = useNewsContext();

	return (
		<>
			<LeftBarTitle text="KSP Challenges" />
			<select id="challengesSelect" onChange={setChallengeFilter} className="select select-bordered w-full 2k:select-lg 2k:text-xl mb-6 2k:mb-12">
				<optgroup>
					<option value="any">Any</option>
					{!articlesLoading &&
						challenges.map((challenge, i) => {
							return (
								<option key={i} value={challenge.articleId}>
									{challenge.title.length > 40 ? challenge.title.slice(0, 41) + '...' : challenge.title}
								</option>
							);
						})}
				</optgroup>
			</select>
		</>
	);
}

export default IndexLeftBarChallenges;
