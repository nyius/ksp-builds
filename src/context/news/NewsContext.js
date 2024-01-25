import React, { createContext, useReducer, useEffect, useContext } from 'react';
import NewsReducer from './NewsReducer';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';
import { doc, getDocs, where, limit, query, collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';
import errorReport from '../../utilities/errorReport';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
	const initialState = {
		articles: [],
		challenges: [],
		heroArticles: [],
		streams: [],
		articlesLoading: true,
		deletePatchNoteId: null,
		editingPatchNotes: false,
		streamsLoading: true,
		currentHeroSlide: 0,
		heroSlidesLength: 10,
		challengeChunks: [],
		lastChallengeChunkFetched: 0,
		challengesLength: 0,
	};

	// News
	useEffect(() => {
		const fetchNews = async () => {
			try {
				//Get official News Articles---------------------------------------------------------------------------------------------------//
				const getNewsCommand = new GetObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `kspNews.json`,
				});

				let newsResponse = await s3Client.send(getNewsCommand);
				let rawNews = await newsResponse.Body.transformToString();
				let parsedNews = JSON.parse(rawNews);

				//Get KSP Builds articles ---------------------------------------------------------------------------------------------------//
				const articlesCol = collection(db, 'articles');
				const articlesConstraints = [limit(4)];
				const articlesQuery = query(articlesCol, ...articlesConstraints);
				const kspBuildsArticles = await getDocs(articlesQuery);

				kspBuildsArticles.forEach(doc => {
					const article = doc.data();
					article.date = createDateFromFirebaseTimestamp(article.date.seconds);
					parsedNews.push(article);
				});

				const sortedArticles = parsedNews.sort((a, b) => {
					let aDate = new Date(a.date);
					let bDate = new Date(b.date);

					return aDate < bDate ? 1 : -1;
				});

				sortedArticles.map(article => {
					article.type = 'article';
					return article;
				});

				dispatchNews({
					type: 'SET_NEWS',
					payload: sortedArticles,
				});

				dispatchNews({
					type: 'SET_ARTICLES_LOADING',
					payload: false,
				});
			} catch (error) {
				if (error.message.includes('NetworkError') || error.message.includes('Load failed') || error.message.includes('between the request time') || error.message.includes('network error')) {
					errorReport(error.message, false, 'fetchNews');
				} else {
					errorReport(error.message, true, 'fetchNews');
				}
				dispatchNews({
					type: 'SET_ARTICLES_LOADING',
					payload: false,
				});
			}
		};
		fetchNews();
	}, []);

	// Challenges
	useEffect(() => {
		const fetchChallenges = async () => {
			try {
				const getChallengeMapCommand = new GetObjectCommand({
					Bucket: process.env.REACT_APP_CHALLENGE_BUCKET,
					Key: `challenges-map.json`,
				});

				let challengeMapRes = await s3Client.send(getChallengeMapCommand);
				let challengeMapRaw = await challengeMapRes.Body.transformToString();
				let challengeMap = JSON.parse(challengeMapRaw);
				let challengesToFetch = [];
				let localChallenges = [];
				let fetchedChallenges = [];

				/**
				 * Break up our challenges into blocks of 20 for fetching
				 * @param {*} array
				 * @param {*} chunkSize
				 * @returns
				 */
				const chunkArray = (array, chunkSize) => {
					const result = [];

					for (let i = 0; i < array.length; i += chunkSize) {
						result.push(array.slice(i, i + chunkSize));
					}

					return result;
				};

				const challengeChunks = chunkArray(challengeMap, 20);

				challengeChunks[0].map(challenge => {
					const localChallenge = localStorage.getItem(challenge.articleId);

					if (localChallenge) {
						localChallenges.push(JSON.parse(localChallenge));
					} else {
						challengesToFetch.push(challenge);
					}
				});

				if (challengesToFetch.length > 0) {
					await Promise.all(
						challengesToFetch.map(async challenge => {
							const getChallengeCommand = new GetObjectCommand({
								Bucket: process.env.REACT_APP_CHALLENGE_BUCKET,
								Key: `${challenge.articleId}.json`,
							});

							let challengeResponse = await s3Client.send(getChallengeCommand);
							let rawChallenge = await challengeResponse.Body.transformToString();
							let parsedChallege = JSON.parse(rawChallenge);
							fetchedChallenges.push(parsedChallege);

							localStorage.setItem(parsedChallege.articleId, JSON.stringify(parsedChallege));
						})
					);
				}

				const sortedChallenges = [...localChallenges, ...fetchedChallenges];

				sortedChallenges.sort((a, b) => {
					let aDate = new Date(a.date);
					let bDate = new Date(b.date);
					return bDate.getTime() - aDate.getTime();
				});

				dispatchNews({
					type: 'SET_CHALLENGES',
					payload: sortedChallenges,
				});

				dispatchNews({
					type: 'SET_CHALLENGE_CHUNKS',
					payload: challengeChunks,
				});

				dispatchNews({
					type: 'SET_LAST_FETCHED_CHALLENGE_CHUNK',
					payload: 0,
				});

				dispatchNews({
					type: 'SET_CHALLENGES_TOTAL',
					payload: challengeMap.length,
				});

				return;
				/*
				//Get KSP Builds Challenges ---------------------------------------------------------------------------------------------------//
				const challengesColl = collection(db, 'challenges');
				const constraints = [limit(4)];
				const q = query(challengesColl, ...constraints);
				const challenges = await getDocs(q);

				challenges.forEach(doc => {
					const challenge = doc.data();
					challenge.date = createDateFromFirebaseTimestamp(challenge.date.seconds);
					parsedChalleges.push(challenge);
				});

				const sortedChallenges = parsedChalleges.sort((a, b) => {
					let aDate = new Date(a.date);
					let bDate = new Date(b.date);

					return aDate < bDate ? 1 : -1;
				});

				sortedChallenges.map(challenge => {
					challenge.type = 'challenge';
					return challenge;
				});


				*/
			} catch (error) {
				errorReport(error, true, 'fetchChallenges');
			}
		};
		fetchChallenges();
	}, []);

	// live Streams
	useEffect(() => {
		const fetchLiveStreams = async () => {
			try {
				const getStreamsCommand = new GetObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `liveKspStreams.json`,
				});

				let streamsResponse = await s3Client.send(getStreamsCommand);
				let rawStreams = await streamsResponse.Body.transformToString();
				let parsedStreams = JSON.parse(rawStreams);

				dispatchNews({
					type: 'SET_STREAMS',
					payload: parsedStreams.data,
				});
				dispatchNews({
					type: 'SET_STREAMS_LOADING',
					payload: false,
				});
			} catch (error) {
				errorReport(error.message, false, 'fetchLiveStreams');
				dispatchNews({
					type: 'SET_STREAMS_LOADING',
					payload: false,
				});
			}
		};

		fetchLiveStreams();
	}, []);

	const [state, dispatchNews] = useReducer(NewsReducer, initialState);

	return <NewsContext.Provider value={{ ...state, dispatchNews }}>{children}</NewsContext.Provider>;
};

/**
 * News Context
 * @returns
 */
export const useNewsContext = () => {
	const context = useContext(NewsContext);

	return context;
};

export default NewsContext;
