import React, { useContext } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import NewsCard from '../../components/news/NewsCard';
import NewsContext from '../../context/news/NewsContext';
import Helmet from '../../components/Helmet/Helmet';
import Spinner1 from '../../components/spinners/Spinner1';
import NewsArticles from './Components/NewsArticles';

/**
 * KSP News Page
 * @returns
 */
function News() {
	const { articles, articlesLoading } = useContext(NewsContext);

	if (articlesLoading) {
		return (
			<MiddleContainer>
				<Spinner1 />
			</MiddleContainer>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Latest KSP 2 News" pageLink="https://kspbuilds.com/news" />

			<MiddleContainer>
				<PlanetHeader text="Latest KSP News" />

				<NewsArticles />
			</MiddleContainer>
		</>
	);
}

export default News;
