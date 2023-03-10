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
		<div className="sidebar-right z-50 bg-base-800 rounded-xl p-6 2k:p-8 h-screen overflow-auto scrollbar fixed left-bar">
			<h1 className="text-2xl 2k:text-4xl text-slate-100 font-bold mb-2 2k:mb-8 text-center">KSP2 News</h1>
			<div className="flex flex-col gap-10 2k:gap-20">
				{news.map((article, i) => {
					return <NewsCard key={i} article={article} />;
				})}
			</div>
		</div>
	);
}

export default RightBar;
