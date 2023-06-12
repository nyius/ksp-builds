import React, { createContext, useState, useReducer, useEffect } from 'react';
import NewsReducer from './NewsReducer';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';
import { doc, getDocs, where, limit, query, collection } from 'firebase/firestore';
import { db } from '../../firebase.config';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
	const initialState = {
		articles: [],
		challenges: [],
		articlesLoading: true,
		deletePatchNoteId: null,
		editingPatchNotes: false,
	};

	useEffect(() => {
		const fetchNews = async () => {
			try {
				let parsedChalleges = [];
				let parsedNews;

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
					// Fetch challenges from official website
					const getChallengesCommand = new GetObjectCommand({
						Bucket: process.env.REACT_APP_BUCKET,
						Key: `kspChallenges.json`,
					});

					let challengesResponse = await s3Client.send(getChallengesCommand);
					let rawChallenges = await challengesResponse.Body.transformToString();
					parsedChalleges = JSON.parse(rawChallenges);

					// fetch KSPbuilds challenges
					const challengesColl = collection(db, 'challenges');
					const constraints = [limit(4)];
					const q = query(challengesColl, ...constraints);
					const challenges = await getDocs(q);

					challenges.forEach(doc => {
						const challenge = doc.data();
						challenge.date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(challenge.date.seconds * 1000);
						parsedChalleges.push(challenge);
					});
				} catch (error) {
					console.log(error);
				}

				const sortedChallenges = parsedChalleges.sort((a, b) => {
					let aDate = new Date(a.date);
					let bDate = new Date(b.date);

					return aDate < bDate ? 1 : -1;
				});

				dispatchNews({
					type: 'SET_CHALLENGES',
					payload: sortedChallenges,
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
