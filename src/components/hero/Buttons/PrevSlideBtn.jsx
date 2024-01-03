import React from 'react';
import Button from '../../buttons/Button';
import { useNewsContext } from '../../../context/news/NewsContext';
import { prevHeroSlide } from '../../../context/news/NewsActions';

/**
 * Goes to prev hero slide
 * @returns
 */
function PrevSlideBtn({ resetTimer }) {
	const { dispatchNews } = useNewsContext();

	return (
		<Button
			icon="left2"
			size="!btn-circle"
			color="text-slate-100"
			css="border-0 hover:border-r-4 !border-primary"
			onClick={() => {
				prevHeroSlide(dispatchNews);
				resetTimer();
			}}
			position="z-51 absolute left-2 sm:left-auto sm:relative"
		/>
	);
}

export default PrevSlideBtn;
