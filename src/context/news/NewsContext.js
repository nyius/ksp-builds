import React, { createContext, useState, useReducer, useEffect } from 'react';
import NewsReducer from './NewsReducer';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
	const initialState = {
		articles: [],
		articlesLoading: true,
	};

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const command = new GetObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `kspNews.json`,
				});

				let response = await s3Client.send(command);
				let rawNews = await response.Body.transformToString();
				let parsedNews = JSON.parse(rawNews);

				dispatchNews({
					type: 'SET_NEWS',
					payload: parsedNews,
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
