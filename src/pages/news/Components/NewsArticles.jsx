import React from 'react';
import { useNewsContext } from '../../../context/news/NewsContext';
import NewsCard from '../../../components/cards/NewsCard';

/**
 * Displays News Articles
 * @returns
 */
function NewsArticles() {
	const { articles } = useNewsContext();

	return (
		<div className="grid grid-cols-2 lg:grid-cols-3 2k:grid-cols-4 flex-wrap gap-6 2k:gap-12">
			{articles.map((article, i) => {
				return <NewsCard key={i} article={article} />;
			})}
		</div>
	);
}

export default NewsArticles;
