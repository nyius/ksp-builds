import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import NewsContext from '../../../context/news/NewsContext';
import { prevHeroSlide } from '../../../context/news/NewsActions';

/**
 * Goes to prev hero slide
 * @returns
 */
function PrevSlideBtn() {
	const { dispatchNews } = useContext(NewsContext);

	return <Button icon="left2" size="!btn-circle" color="text-slate-100" onClick={() => prevHeroSlide(dispatchNews)} position="z-110 absolute sm:relative" />;
}

export default PrevSlideBtn;
