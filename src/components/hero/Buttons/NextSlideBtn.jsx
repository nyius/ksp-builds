import React, { useContext } from 'react';
import Button from '../../buttons/Button';
import NewsContext from '../../../context/news/NewsContext';
import { nextHeroSlide } from '../../../context/news/NewsActions';

/**
 * Goes to next hero slide
 * @returns
 */
function NextSlideBtn() {
	const { dispatchNews } = useContext(NewsContext);

	return <Button icon="right2" size="!btn-circle" color="text-slate-100" onClick={() => nextHeroSlide(dispatchNews)} position="z-51 absolute right-2 sm:right-auto sm:relative" />;
}

export default NextSlideBtn;
