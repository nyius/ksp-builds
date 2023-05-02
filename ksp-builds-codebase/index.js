const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cheerio = require('cheerio');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
admin.initializeApp();
const { TwitterApi } = require('twitter-api-v2');
const { firebase } = require('googleapis/build/src/apis/firebase');

// Gets the news articles
exports.scrapeNews = functions.pubsub.schedule('0 * * * *').onRun(async context => {
	try {
		const s3Client = new S3Client({
			apiVersion: 'latest',
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
			},
		});
		// every hour '0 * * * *'
		const data = [];
		const challenges = [];

		const newsData = await scrapeNews();
		const patchData = await scrapePatchNotes();
		const devData = await scrapeDevDiaries();
		const challengesData = await scrapeChallenges();

		// add all the article to one array
		for (const article in newsData) {
			data.push(newsData[article]);
		}
		for (const article in patchData) {
			data.push(patchData[article]);
		}
		for (const article in devData) {
			data.push(devData[article]);
		}
		for (const article in challengesData) {
			challenges.push(challengesData[article]);
		}

		// sort the array by date
		data.sort((a, b) => {
			const aDate = new Date(a.date);
			const bDate = new Date(b.date);
			return bDate - aDate;
		});
		challengesData.sort((a, b) => {
			const aDate = new Date(a.date);
			const bDate = new Date(b.date);
			return bDate - aDate;
		});

		const dataJSON = JSON.stringify(data);
		const challengesJson = JSON.stringify(challengesData);

		const command = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
			Body: dataJSON,
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		const response = await s3Client.send(command);

		const challengesCommand = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
			Body: challengesJson,
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		const challengesResponse = await s3Client.send(challengesCommand);

		// return 20 articles
		return {
			status: 'success',
			message: 'Did the thing',
		};
	} catch (error) {
		console.log(error);
	}
});

/**
 * handles posting a tweet
 */
exports.postTweet = functions.https.onRequest(async (req, res) => {
	try {
		let accessToken;
		const docRef = admin.firestore().doc(`adminPanel/twitter`);

		// See if that channel exists
		await docRef.get().then(docSnap => {
			if (!docSnap.exists) {
				throw new functions.https.HttpsError(`Didn't find the twitter doc in adminPanel`);
			}
			const data = docSnap.data();
			accessToken = data.accessToken;
		});

		const client = new TwitterApi(accessToken);
		await client.v2.tweet('Hello World!');

		// Example uploading images to twitter (with V1)
		// First, post all your images to Twitter
		// const mediaIds = await Promise.all([
		// 	// file path
		// 	client.v1.uploadMedia('./my-image.jpg'),
		// 	// from a buffer, for example obtained with an image modifier package
		// 	client.v1.uploadMedia(Buffer.from(rotatedImage), { type: 'png' }),
		// ]);
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * handles initial twitter verifications setup. Need to visit link on google cloud functions logger to start verifications.
 */
exports.startTwitterVerify = functions.https.onRequest(async (req, res) => {
	try {
		// INITIAL VERIFYING
		const client = new TwitterApi({
			clientId: process.env.REACT_APP_TWITTER_CLIENT,
			clientSecret: process.env.REACT_APP_TWITTER_SECRET,
		});

		const { url, codeVerifier, state } = client.generateOAuth2AuthLink('https://us-central1-kspbuilds.cloudfunctions.net/verifyTwitter', { scope: ['tweet.write', 'offline.access'] });
		functions.logger.log('Please go to', url);

		const twitterDbRef = admin.firestore().doc(`adminPanel/twitter`);
		await twitterDbRef.update({
			codeVerifier,
			state,
		});

		res.json({
			status: 200,
			url: url,
		});
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * Handles verifying the twitter account and getting us the proper tokens to access it
 */
exports.verifyTwitter = functions.https.onRequest(async (req, res) => {
	try {
		let codeVerifier;
		const { state, code } = req.query;

		const client = new TwitterApi({
			clientId: process.env.REACT_APP_TWITTER_CLIENT,
			clientSecret: process.env.REACT_APP_TWITTER_SECRET,
		});

		const docRef = admin.firestore().doc(`adminPanel/twitter`);

		// See if that channel exists
		await docRef.get().then(docSnap => {
			if (!docSnap.exists) {
				throw new functions.https.HttpsError(`Didn't find the twitter doc in adminPanel`);
			}
			const data = docSnap.data();
			codeVerifier = data.codeVerifier;
		});

		if (!codeVerifier || !state || !code) {
			return res.status(400).send('You denied the app or your session expired!');
		}

		const { loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({ code, codeVerifier, redirectUri: 'https://us-central1-kspbuilds.cloudfunctions.net/verifyTwitter' });

		const twitterDbRef = admin.firestore().doc(`adminPanel/twitter`);
		await twitterDbRef.update({
			accessToken,
			refreshToken,
			expiresIn,
		});

		res.json({
			status: 200,
			message: `Verified!`,
		});
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * handles refreshing the twitter auth so we stay logged in
 */
exports.refreshTwitterAuth = functions.pubsub.schedule('every 2 hours').onRun(async context => {
	try {
		let refreshTokenOld;
		const docRef = admin.firestore().doc(`adminPanel/twitter`);

		// See if that channel exists
		await docRef.get().then(docSnap => {
			if (!docSnap.exists) {
				throw new functions.https.HttpsError(`Didn't find the twitter doc in adminPanel`);
			}
			const data = docSnap.data();
			refreshTokenOld = data.refreshToken;
		});

		const client = new TwitterApi({
			clientId: process.env.REACT_APP_TWITTER_CLIENT,
			clientSecret: process.env.REACT_APP_TWITTER_SECRET,
		});

		const { accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshTokenOld);

		const twitterDbRef = admin.firestore().doc(`adminPanel/twitter`);
		twitterDbRef.update({
			refreshToken,
			accessToken,
		});
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * handles clearing the weekly upvoted craft, for the new week
 */
exports.clearWeeklyUpvotedBuilds = functions.pubsub.schedule('every sun 23:00').onRun(async context => {
	try {
		const docRef = admin.firestore().doc(`kspInfo/weeklyUpvoted`);

		await docRef.delete();
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * handles generating the build of the week
 */
exports.generateBuildOfTheWeek = functions.https.onRequest(async (req, res) => {
	try {
		// Fetch the weekly upvoted builds
		const weeklyUpvotedRef = admin.firestore().doc(`kspInfo/weeklyUpvoted`);
		const weeklyFeaturedBuildsRef = admin.firestore().doc(`kspInfo/weeklyFeaturedBuilds`);
		let weeklyFeaturedBuildsData;

		await weeklyFeaturedBuildsRef.get().then(docSnap => {
			if (!docSnap.exists) {
				throw new functions.https.HttpsError(`Couldn't find the weekly featured`);
			}

			weeklyFeaturedBuildsData = docSnap.data();
		});

		await weeklyUpvotedRef.get().then(docSnap => {
			if (!docSnap.exists) {
				throw new functions.https.HttpsError(`Couldn't find the weekly upvoted builds`);
			}

			const weeklyUpvoted = docSnap.data();

			// Get the highest upvoted builds ---------------------------------------------------------------------------------------------------//
			let highest;
			let builds = [];

			for (const build in weeklyUpvoted) {
				if (weeklyFeaturedBuildsData[build]) {
					// This build was already featured, ignore it
				} else {
					if (highest) {
						if (weeklyUpvoted[build].length >= highest) {
							highest = weeklyUpvoted[build].length;
						}
					} else {
						highest = weeklyUpvoted[build].length;
					}
					builds.push([build, weeklyUpvoted[build].length]);
				}
			}

			const filtered = builds.filter(build => {
				return build[1] >= highest;
			});

			functions.logger.log('builds:', filtered);

			// Pick a random build ---------------------------------------------------------------------------------------------------//
			// Fetch it from the DB ---------------------------------------------------------------------------------------------------//
			// Create a new 'weekly best build' doc ---------------------------------------------------------------------------------------------------//
		});
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * Handles scraping the KSP website for news articles
 * @returns
 */
const scrapeNews = async () => {
	const articles = [];
	// Scrape the new articles
	const axiosResponse = await axios.request({
		method: 'GET',
		url: 'https://www.kerbalspaceprogram.com/news',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
	});

	const $ = cheerio.load(axiosResponse.data);

	const htmlElement = $('.css-180q35u');

	$('.css-180q35u')
		.find('.css-41n5y6')
		.each((i, element) => {
			// Extract data
			const image = $(element).find('.css-1hbpsw3').find('.css-llahnu').find('img').attr('srcset');
			const date = $(element).find('.css-jwjfk5').find('.css-og1fvt').find('time').text();
			const title = $(element).find('.css-jwjfk5').find('.css-kv05w6').text();
			const article = {
				image,
				date,
				title,
				type: 'news',
				url: 'https://www.kerbalspaceprogram.com/news',
			};

			articles.push(article);
		});
	const dataJSON = articles;
	return dataJSON;
};
/**
 * Handles scraping the KSP website for patch notes
 * @returns
 */
const scrapePatchNotes = async () => {
	const articles = [];
	// Scrape the new articles
	const axiosResponse = await axios.request({
		method: 'GET',
		url: 'https://www.kerbalspaceprogram.com/patch-notes',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
	});

	const $ = cheerio.load(axiosResponse.data);

	const htmlElement = $('.css-180q35u');

	$('.css-180q35u')
		.find('.css-41n5y6')
		.each((i, element) => {
			// Extract data
			const image = $(element).find('.css-1hbpsw3').find('.css-llahnu').find('img').attr('srcset');
			const date = $(element).find('.css-jwjfk5').find('.css-og1fvt').find('time').text();
			const title = $(element).find('.css-jwjfk5').find('.css-kv05w6').text();
			const article = {
				image,
				date,
				title,
				type: 'Patch Notes',
				url: 'https://www.kerbalspaceprogram.com/patch-notes',
			};

			articles.push(article);
		});
	const dataJSON = articles;
	return dataJSON;
};
/**
 * Handles scraping the KSP website for patch notes
 * @returns
 */
const scrapeDevDiaries = async () => {
	const articles = [];
	// Scrape the new articles
	const axiosResponse = await axios.request({
		method: 'GET',
		url: 'https://www.kerbalspaceprogram.com/dev-diaries',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
	});

	const $ = cheerio.load(axiosResponse.data);

	const htmlElement = $('.css-180q35u');

	$('.css-180q35u')
		.find('.css-41n5y6')
		.each((i, element) => {
			// Extract data
			const image = $(element).find('.css-1hbpsw3').find('.css-llahnu').find('img').attr('srcset');
			const date = $(element).find('.css-jwjfk5').find('.css-og1fvt').find('time').text();
			const title = $(element).find('.css-jwjfk5').find('.css-kv05w6').text();
			const article = {
				image,
				date,
				title,
				type: 'Dev Diary',
				url: 'https://www.kerbalspaceprogram.com/dev-diaries',
			};

			articles.push(article);
		});
	const dataJSON = articles;
	return dataJSON;
};
/**
 * Handles scraping the KSP website for weekly challenges
 * @returns
 */
const scrapeChallenges = async () => {
	const articles = [];
	// Scrape the new articles
	const axiosResponse = await axios.request({
		method: 'GET',
		url: 'https://www.kerbalspaceprogram.com/challenges',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		},
	});

	const $ = cheerio.load(axiosResponse.data);

	const htmlElement = $('.css-180q35u');
	let articlePromises = [];

	$('.css-1cc0i4l').each((i, element) => {
		// Extract data
		const articleId = $(element).find('.css-180q35u').attr('data-article');
		const image = $(element).find('.css-180q35u').find('.css-41n5y6').find('.css-1hbpsw3').find('.css-llahnu').find('img').attr('srcset');
		const date = $(element).find('.css-180q35u').find('.css-41n5y6').find('.css-jwjfk5').find('.css-og1fvt').find('time').text();
		const title = $(element).find('.css-180q35u').find('.css-41n5y6').find('.css-jwjfk5').find('.css-kv05w6').text();
		const article = {
			image,
			date,
			title,
			articleId,
			type: 'Challenge',
			url: 'https://www.kerbalspaceprogram.com/challenges',
		};

		// Fetch the actual article
		const fetchArticle = () => {
			try {
				articlePromises.push(
					axios
						.get(`https://www.kerbalspaceprogram.com/api/getnewsarticle?id=${articleId}`, {
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
							},
						})
						.then(res => {
							return res.data;
						})
				);
			} catch (error) {
				functions.logger.log(error);
			}
		};

		fetchArticle();

		articles.push(article);
	});

	await Promise.all(articlePromises).then(res => {
		res.map((articleRes, i) => {
			articles[i].article = articleRes;
		});
	});

	const dataJSON = articles;
	return dataJSON;
};
