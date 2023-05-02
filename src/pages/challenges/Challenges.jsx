import React, { useState, useEffect, useContext } from 'react';
import NewsContext from '../../context/news/NewsContext';
import { Helmet } from 'react-helmet';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import ChallengeCard from '../../components/cards/ChallengeCard';
import Spinner1 from '../../components/spinners/Spinner1';

function Challenges() {
	const { challenges, articlesLoading } = useContext(NewsContext);

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Challenges</title>
				<link rel="canonical" href={`https://kspbuilds.com/challenges`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="Challenges" />
				{articlesLoading && <Spinner1 />}
				{!articlesLoading && challenges && (
					<div className="flex flex-row flex-wrap">
						{challenges.map((challenge, i) => {
							return <ChallengeCard i={i} key={i} challenge={challenge} />;
						})}
					</div>
				)}
			</MiddleContainer>
		</>
	);
}

export default Challenges;
