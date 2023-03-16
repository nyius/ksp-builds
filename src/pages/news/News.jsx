import React, { useContext } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import NewsCard from '../../components/news/NewsCard';
import NewsContext from '../../context/news/NewsContext';
import { Helmet } from 'react-helmet';

function News() {
	const { articles, articlesLoading } = useContext(NewsContext);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Latest KSP 2 News</title>
				<link rel="canonical" href={`https://kspbuilds.com/news`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="Latest KSP News" />
				<div className="grid grid-cols-2 lg:grid-cols-3 2k:grid-cols-4 flex-wrap gap-6 2k:gap-12">
					{!articlesLoading &&
						articles.map((article, i) => {
							return <NewsCard key={i} article={article} />;
						})}
				</div>
			</MiddleContainer>
		</>
	);
}

export default News;
