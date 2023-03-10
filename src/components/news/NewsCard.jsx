import React from 'react';
import { useNavigate } from 'react-router-dom';

function NewsCard({ article }) {
	const navigate = useNavigate();

	return (
		<a className="rounded-lg bg-base-900 cursor-pointer hover:bg-slate-700" href={article.url} target="_blank">
			<img src={article.image} alt="" className="w-full" />
			<div className="flex flex-col p-4 2k:p-8">
				<p className="text-lg 2k:text-2xl text-slate-500">{article.date}</p>
				<p className="text-lg 2k:text-2xl text-slate-200">{article.title}</p>
			</div>
		</a>
	);
}

export default NewsCard;
