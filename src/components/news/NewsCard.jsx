import React from 'react';

/**
 * News Card Component
 * @param {obj} article - the news article to display
 * @returns
 */
function NewsCard({ article }) {
	return (
		<a className="flex flex-col rounded-lg bg-base-300 cursor-pointer relative min-w-12 max-w-4xl" href={article.url} target="_blank">
			<div className="hover:bg-primary hover:shadow-xl">
				<div className="relative">
					<img src={article.image} alt="" className="w-full " />
					<div className="badge text-xl 2k:text-2xl p-3 2k:p-5 absolute bottom-2 right-2 text-slate-200">{article.type}</div>
				</div>
				<div className="flex flex-col p-4 2k:p-8">
					<p className="text-lg 2k:text-2xl text-slate-500">{article.date}</p>
					<p className="text-lg 2k:text-2xl text-slate-200">{article.title}</p>
				</div>
			</div>
		</a>
	);
}

export default NewsCard;
