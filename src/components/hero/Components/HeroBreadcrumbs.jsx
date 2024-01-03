import React from 'react';
import { useNewsContext } from '../../../context/news/NewsContext';
import { setHeroSlide } from '../../../context/news/NewsActions';

function HeroBreadcrumbs({ mouseEnterPauseTimer, mouseLeaveRestartTimer }) {
	const { currentHeroSlide, dispatchNews } = useNewsContext();

	return (
		<div className="flex flex-row gap-3 2k:gap-5 items-center">
			{Array.from({ length: 10 }).map((dot, i) => {
				return (
					<div
						key={i}
						className={`rounded-full h-5 w-5 2k:h-6 2k:w-6 border-[1px] border-solid border-slate-500 ${currentHeroSlide === i ? 'bg-slate-200' : ''} cursor-pointer`}
						onClick={e => setHeroSlide(dispatchNews, i)}
						onMouseEnter={mouseEnterPauseTimer}
						onMouseLeave={mouseLeaveRestartTimer}
					></div>
				);
			})}
		</div>
	);
}

export default HeroBreadcrumbs;
