import React from 'react';
import { useNavigate } from 'react-router-dom';

function NewsCard({ article }) {
	const navigate = useNavigate();

	return (
		<a className="flex flex-col rounded-lg bg-base-800 cursor-pointer hover:bg-slate-700 relative min-w-12 max-w-4xl" href={article.url} target="_blank">
			<div className="relative">
				<img src={article.image} alt="" className="w-full " />
				<div className="badge text-xl 2k:text-2xl p-3 2k:p-5 absolute bottom-2 right-2">{article.type}</div>
			</div>
			<div className="flex flex-col p-4 2k:p-8">
				<p className="text-lg 2k:text-2xl text-slate-500">{article.date}</p>
				<p className="text-lg 2k:text-2xl text-slate-200">{article.title}</p>
			</div>
		</a>
	);
}

export default NewsCard;
