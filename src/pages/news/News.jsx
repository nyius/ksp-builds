import React, { useContext } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import NewsCard from '../../components/news/NewsCard';
import NewsContext from '../../context/news/NewsContext';

function News() {
	const { articles, articlesLoading } = useContext(NewsContext);

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Latest KSP News" />
			<div className="grid grid-cols-2 lg:grid-cols-3 2k:grid-cols-4 flex-wrap gap-6 2k:gap-12">
				{!articlesLoading &&
					articles.map((article, i) => {
						return <NewsCard key={i} article={article} />;
					})}
			</div>
		</MiddleContainer>
	);
}

export default News;
