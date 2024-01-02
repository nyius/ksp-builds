import React from 'react';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import Button from '../buttons/Button';

/**
 * Displays the article card
 * @param {*} article - the article to display
 * @param {int} i - array index
 * @returns
 */
function HeroNewsCard({ article, i }) {
	const navigate = useNavigate();

	const date = new Date(article.date);

	return (
		<>
			<div className="2xl:w-300 h-full flex flex-col items-center justify-center overflow-hidden z-50">
				<img
					src={article?.image ? article?.image : 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/kspbuilds_update_default.png?alt=media&token=daa83171-d7f5-4292-b89c-b15ff06b31c6'}
					alt={article?.title}
					className="rounded-lg z-50 cursor-pointer"
					onClick={() => navigate(`/news/${article?.articleId}`)}
				/>
			</div>

			<div className="flex flex-col w-full px-4 justify-center">
				<div className="flex flex-row flex-wrap gap-2 2k:gap-4 mb-2 2k:mb-4">
					<p className="text-3xl 2k:text-5xl text-white font-bold z-50 truncate-3">{article?.title}</p>
					{i === 0 && <p className="badge badge-secondary text-xl 2k:text-2xl p-4">New!</p>}
					{article?.url ? <p className="badge badge-primary text-xl 2k:text-2xl p-4">Official</p> : <p className="badge badge-accent text-xl 2k:text-2xl p-4">KSPB Article</p>}
				</div>
				<p className="text-lg 2k:text-2xl italic text-slate-500 mb-10 2k:mb-20 z-50 shrink-0">{date.toDateString()}</p>
				<div className="flex flex-row flex-wrap gap-4 2k:gap-6">
					{article?.url ? (
						<Button type="ahref" href={article?.url} target="_blank" text="Read more" icon="right" color="btn-dark text-white" position="z-50" size="w-fit" />
					) : (
						<Button type="ahref" href={`/news/${article?.articleId}`} text="Read more" icon="right" color="btn-dark text-white" position="z-50" size="w-fit" />
					)}
				</div>
			</div>
		</>
	);
}

export default HeroNewsCard;
