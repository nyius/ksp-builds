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
			} catch (error) {
				console.log(error);
				dispatchNews({
					type: 'SET_ARTICLES_LOADING',
					payload: false,
				});
			}
		};

		fetchNews();
	}, []);

	const [state, dispatchNews] = useReducer(NewsReducer, initialState);

	return <NewsContext.Provider value={{ ...state, dispatchNews }}>{children}</NewsContext.Provider>;
};

export default NewsContext;
