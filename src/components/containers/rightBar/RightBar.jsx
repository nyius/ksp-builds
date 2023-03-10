import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from '../../news/NewsCard';

function RightBar() {
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
		<div className="sidebar-right bg-base-400 rounded-xl p-4 h-screen overflow-auto scrollbar">
			<h1 className="text-2xl 2k:text-4xl text-slate-100 font-bold mb-2 text-center">KSP2 News</h1>
			<div className="flex flex-col gap-3 2k:gap-6">
				{news.map(article => {
					return <NewsCard article={article} />;
				})}
			</div>
		</div>
	);
}

export default RightBar;
