import React, { useContext } from 'react';
import NewsContext from './NewsContext';

function useNews() {
	const { dispatchNews } = useContext(NewsContext);
	/**
	 * handles setting the news
	 */
	const setNews = news => {
		dispatchNews({
			type: 'SET_NEWS',
			payload: news,
		});
	};

	/**
	 * Handles setting the loading state
	 * @param {*} bool
	 */
	const setNewsLoading = bool => {
		dispatchNews({
			type: 'SET_ARTICLES_LOADING',
			payload: bool,
		});
	};

	return { setNews, setNewsLoading };
}

export default useNews;
