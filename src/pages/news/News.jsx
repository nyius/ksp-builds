import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import NewsCard from '../../components/news/NewsCard';

function News() {
	const [news, setNews] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:4000/news').then(res => {
			if (res.data.message) {
				setNews(JSON.parse(res.data.data));
			}
		});
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Latest KSP News" />
			<div className="grid grid-cols-2 lg:grid-cols-3 2k:grid-cols-4 flex-wrap gap-6 2k:gap-12">
				{news.map(article => {
					return <NewsCard article={article} />;
				})}
			</div>
		</MiddleContainer>
	);
}

export default News;
