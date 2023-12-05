import React from 'react';
import DefaultArticleImage from '../../assets/kspbuilds_update_default.png';

/**
 * News Card Component
 * @param {obj} article - the news article to display
 * @returns
 */
function NewsCard({ article }) {
	return (
		<>
			<a className="flex flex-col rounded-lg bg-base-200 cursor-pointer relative min-w-12 max-w-4x" href={article.url} target="_blank">
				<div className="hover:bg-primary hover:shadow-xl h-full flex flex-col place-content-between">
					<img src={article.image ? article.image : DefaultArticleImage} alt="" className="w-full " />
					<div className="flex flex-col p-4 2k:p-8">
						<p className="text-lg 2k:text-2xl text-slate-400">{article.date}</p>
						<p className="text-lg 2k:text-2xl text-slate-100">{article.title}</p>
					</div>
				</div>
			</a>
		</>
	);
}

export default NewsCard;
