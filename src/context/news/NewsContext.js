import React, { createContext, useState, useReducer, useEffect } from 'react';
import NewsReducer from './NewsReducer';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
	const initialState = {
		articles: [],
		challenges: [],
		articlesLoading: true,
	};

	useEffect(() => {
		const fetchNews = async () => {
			const storedNews = JSON.parse(window.localStorage.getItem('news'));

			if (storedNews) {
				const timeToCheck = 20 * 60 * 1000;
				const timeframe = Date.now() - timeToCheck;
				const oldDate = new Date(storedNews.date);

				if (oldDate < timeframe) {
					dispatchNews({
						type: 'SET_NEWS',
						payload: storedNews.articles,
					});

					dispatchNews({
						type: 'SET_CHALLENGES',
						payload: storedNews.challenges,
					});
					dispatchNews({
						type: 'SET_ARTICLES_LOADING',
						payload: false,
					});
				}
			} else {
				try {
					let parsedChalleges, parsedNews;

					const getNewsCommand = new GetObjectCommand({
						Bucket: process.env.REACT_APP_BUCKET,
						Key: `kspNews.json`,
					});

					let response = await s3Client.send(getNewsCommand);
					let rawNews = await response.Body.transformToString();
					parsedNews = JSON.parse(rawNews);

					dispatchNews({
						type: 'SET_NEWS',
						payload: parsedNews,
					});

					try {
						const getChallengesCommand = new GetObjectCommand({
							Bucket: process.env.REACT_APP_BUCKET,
							Key: `kspChallenges.json`,
						});

						let challengesResponse = await s3Client.send(getChallengesCommand);
						let rawChallenges = await challengesResponse.Body.transformToString();
						parsedChalleges = JSON.parse(rawChallenges);
					} catch (error) {
						console.log(error);
					}

					dispatchNews({
						type: 'SET_CHALLENGES',
						payload: parsedChalleges,
					});
					dispatchNews({
						type: 'SET_ARTICLES_LOADING',
						payload: false,
					});

					// set local storage
					const fetchedArticles = {
						articles: parsedNews,
						challenges: parsedChalleges,
						date: new Date(),
					};

					window.localStorage.setItem('news', JSON.stringify(fetchedArticles));
				} catch (error) {
					console.log(error);
					dispatchNews({
						type: 'SET_ARTICLES_LOADING',
						payload: false,
					});
				}
			}
		};

		fetchNews();
	}, []);

	const [state, dispatchNews] = useReducer(NewsReducer, initialState);

	return <NewsContext.Provider value={{ ...state, dispatchNews }}>{children}</NewsContext.Provider>;
};

export default NewsContext;
