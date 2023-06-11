import React, { useContext } from 'react';
import NewsCard from '../../news/NewsCard';
import NewsContext from '../../../context/news/NewsContext';

function RightBar() {
	const { articles, articlesLoading } = useContext(NewsContext);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="sidebar-right z-10 bg-base-800 rounded-xl p-6 2k:p-8 h-screen overflow-auto scrollbar fixed left-bar right-1">
			<h1 className="text-2xl 2k:text-4xl text-slate-100 font-bold mb-2 2k:mb-8 text-center">KSP2 News</h1>
			<div className="flex flex-col gap-10 2k:gap-15">
				{!articlesLoading &&
					articles.map((article, i) => {
						return <NewsCard key={i} article={article} />;
					})}
			</div>
		</div>
	);
}

export default RightBar;
