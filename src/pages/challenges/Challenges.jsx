import React, { useContext } from 'react';
import NewsContext from '../../context/news/NewsContext';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Spinner1 from '../../components/spinners/Spinner1';
import Helmet from '../../components/Helmet/Helmet';
import ChallengesList from './Components/ChallengesList';

/**
 * Challenges page
 * @returns
 */
function Challenges() {
	const { articlesLoading } = useContext(NewsContext);

	if (articlesLoading) {
		return (
			<MiddleContainer>
				<Spinner1 />
			</MiddleContainer>
		);
	}

	return (
		<>
			<Helmet title="Challenges" pageLink="https://kspbuilds.com/challenges" description="View the latest Kerbal Space Program 2 challenges! Try exploring every planet in the kerbin system, place a space station around Duna, and more" />

			<MiddleContainer>
				<PlanetHeader text="Challenges" />
				<ChallengesList />
			</MiddleContainer>
		</>
	);
}

export default Challenges;
