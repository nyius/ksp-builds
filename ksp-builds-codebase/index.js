const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cheerio = require('cheerio');
const firestore = require('firebase/firestore');
const axios = require('axios');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
admin.initializeApp();
const { TwitterApi } = require('twitter-api-v2');
const { firebase } = require('googleapis/build/src/apis/firebase');
const Parser = require('rss-parser');
let parser = new Parser();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET);
const endpointSecret = process.env.REACT_APP_STRIPE_SUCCESS_ENDPOINT_PROD;
// const endpointSecret = 'whsec_ba90833eb62f59831b3b58cd308b311dbeee87a326899886ccdeb196e450e96d';

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

		// sort the array by date
		data.sort((a, b) => {
			const aDate = new Date(a.date);
			const bDate = new Date(b.date);
			return bDate - aDate;
		});

		// Fetch the existing challenges/articles ---------------------------------------------------------------------------------------------------//
		const getNewsCommand = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
		});

		let response = await s3Client.send(getNewsCommand);
		let rawNews = await response.Body.transformToString();
		let fetchedExistingNews = JSON.parse(rawNews);

		// filter any ones that match
		const filteredNews = data.filter(article => !fetchedExistingNews.some(({ title }) => title === article.title));

		// merge them together and save
		let scrapedNews = [...filteredNews, ...data];

		// Upload to News to AWS---------------------------------------------------------------------------------------------------//
		const command = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
			Body: JSON.stringify(scrapedNews),
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		await s3Client.send(command);

		// Fetch existing challenges ---------------------------------------------------------------------------------------------------//
		const getChallengesCommand = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
		});

		let challengesResponse = await s3Client.send(getChallengesCommand);
		let rawChallenges = await challengesResponse.Body.transformToString();
		let fetchedExistingChallenges = JSON.parse(rawChallenges);

		const filteredChallenges = challengesData.filter(challenge => !fetchedExistingChallenges.some(({ title }) => title === challenge.title));

		let scrapedChallenges = [...filteredChallenges, ...challengesData];

		// Upload to Challenges to AWS---------------------------------------------------------------------------------------------------//
		const challengesCommand = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
			Body: JSON.stringify(scrapedChallenges),
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		await s3Client.send(challengesCommand);

		return {
			status: 'success',
			message: 'Did the thing',
		};
	} catch (error) {
		console.log(error);
	}
});

// Gets the news articles manually
exports.scrapeNewsManual = functions.https.onRequest(async context => {
	try {
		const s3Client = new S3Client({
			apiVersion: 'latest',
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
			},
		});

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

		let scrapedNews;

		//Fetch the existing challenges/articles
		const getNewsCommand = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
		});

		let response = await s3Client.send(getNewsCommand);
		let rawNews = await response.Body.transformToString();
		let fetchedExistingNews = JSON.parse(rawNews);

		// filter any ones that match
		const filteredNews = data.filter(article => fetchedExistingNews.some(({ title }) => title !== article.title));

		// merge them together and save
		scrapedNews = [...filteredNews, ...data];

		const command = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
			Body: JSON.stringify(scrapedNews),
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		await s3Client.send(command);

		// return 20 articles
		return {
			status: 'success',
			message: 'Did the thing',
		};
	} catch (error) {
		console.log(error);
	}
});

// Gets the challenges manually
exports.scrapeChallengesManual = functions.https.onRequest(async context => {
	try {
		const s3Client = new S3Client({
			apiVersion: 'latest',
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
			},
		});

		const newChallenges = await scrapeChallenges();
		functions.logger.log(newChallenges);

		const getChallengesCommand = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
		});

		let challengesResponse = await s3Client.send(getChallengesCommand);
		let rawChallenges = await challengesResponse.Body.transformToString();
		let fetchedExistingChallenges = JSON.parse(rawChallenges);

		const filteredChallenges = newChallenges.filter(newChallenge =>
			fetchedExistingChallenges.some(({ title }) => {
				return title !== newChallenge.title;
			})
		);

		let scrapedChallenges = [...filteredChallenges, ...newChallenges];

		const challengesCommand = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
			Body: JSON.stringify(scrapedChallenges),
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		await s3Client.send(challengesCommand);
	} catch (error) {
		functions.logger.log(error);
	}
});

exports.fixChallenges = functions.https.onRequest(async context => {
	try {
		const s3Client = new S3Client({
			apiVersion: 'latest',
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
			},
		});

		const getChallengesCommand = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
		});

		let challengesResponse = await s3Client.send(getChallengesCommand);
		let rawChallenges = await challengesResponse.Body.transformToString();
		let fetchedExistingChallenges = JSON.parse(rawChallenges);

		// const filteredChallenges = challengesData.filter(challenge => !fetchedExistingChallenges.some(({ title }) => title === challenge.title));

		// let scrapedChallenges = [...filteredChallenges, ...challengesData];

		// scrapedChallenges.map(challenge => functions.logger.log(challenge.title));

		let newArr = fetchedExistingChallenges.filter((obj, index, self) => {
			return index === self.findIndex(o => o.title === obj.title);
		});

		const challengesCommand = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspChallenges.json`,
			Body: JSON.stringify(newArr),
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		// await s3Client.send(challengesCommand);
	} catch (error) {
		functions.logger.log(error);
	}
});

exports.fixNews = functions.https.onRequest(async context => {
	try {
		const s3Client = new S3Client({
			apiVersion: 'latest',
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
			},
		});

		const getChallengesCommand = new GetObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
		});

		let newsRes = await s3Client.send(getChallengesCommand);
		let rawNews = await newsRes.Body.transformToString();
		let fetchedExistingNews = JSON.parse(rawNews);

		let newArr = fetchedExistingNews.filter((obj, index, self) => {
			return index === self.findIndex(o => o.title === obj.title);
		});

		const challengesCommand = new PutObjectCommand({
			Bucket: process.env.REACT_APP_BUCKET,
			Key: `kspNews.json`,
			Body: JSON.stringify(newArr),
			ContentEncoding: 'base64',
			ContentType: 'application/json',
			ACL: 'public-read',
		});

		await s3Client.send(challengesCommand);
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * handles posting a tweet
 */
/*
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
*/

/**
 * handles initial twitter verifications setup. Need to visit link on google cloud functions logger to start verifications.
 */
/*
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
*/

/**
 * Handles verifying the twitter account and getting us the proper tokens to access it
 */
/*
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
*/

/**
 * handles refreshing the twitter auth so we stay logged in
 */
/*
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
*/

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
 * Handles listening for stripe
 */
exports.handleStripePayments = functions.https.onRequest(async (req, res) => {
	try {
		let event = req.rawBody;
		// Only verify the event if you have an endpoint secret defined.
		// Otherwise use the basic event deserialized with JSON.parse
		if (endpointSecret) {
			// Get the signature sent by Stripe
			const signature = req.headers['stripe-signature'];
			try {
				event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
			} catch (err) {
				console.log(`⚠️  Webhook signature verification failed.`, err.message);
				return res.sendStatus(400);
			}
		}

		// Handle the event
		switch (event.type) {
			case 'payment_intent.succeeded':
				const paymentIntent = event.data.object;
				break;
			case 'checkout.session.async_payment_succeeded':
				const checkoutSessionAsyncPaymentSucceeded = event.data.object;
			case 'customer.subscription.created':
				const subscriptionObj = event.data.object;
				break;
			case 'checkout.session.completed':
				const checkoutObj = event.data.object;

				functions.logger.log(`User (KSPB ID:${checkoutObj.client_reference_id}, STRIPE ID: ${checkoutObj.customer}) subscribed!`);

				if (checkoutObj.status === 'complete') {
					const userRef = admin.firestore().doc(`users/${checkoutObj.client_reference_id}`);
					const userProfileRef = admin.firestore().doc(`userProfiles/${checkoutObj.client_reference_id}`);

					await userRef.update({
						subscribed: `tier${checkoutObj.metadata.tier}`,
						subscriptionDate: new Date(),
						stripeCustomerID: checkoutObj.customer,
						lastModified: admin.firestore.FieldValue.serverTimestamp(),
					});
					await userProfileRef.update({
						subscribed: `tier${checkoutObj.metadata.tier}`,
						subscriptionDate: new Date(),
						stripeCustomerID: checkoutObj.customer,
						lastModified: admin.firestore.FieldValue.serverTimestamp(),
					});
				}
				break;
			case 'customer.subscription.deleted':
				const subscriptionDeleted = event.data.object;
				functions.logger.log(`user ${subscriptionDeleted.customer} subscription expired`);

				await admin
					.firestore()
					.collection(`users`)
					.where('stripeCustomerID', '==', subscriptionDeleted.customer)
					.get()
					.then(snap => {
						snap.forEach(userSnap => {
							const id = userSnap.id;
							const userRef = admin.firestore().doc(`users/${id}`);

							const updateUser = async () => {
								try {
									await userRef.update({
										subscribed: null,
										subscriptionDate: null,
										customUsernameColor: null,
									});
								} catch (error) {
									throw new Error(error);
								}
							};
							updateUser();
						});
					});
				await admin
					.firestore()
					.collection(`userProfiles`)
					.where('stripeCustomerID', '==', subscriptionDeleted.customer)
					.get()
					.then(snap => {
						snap.forEach(userSnap => {
							const id = userSnap.id;
							const userprofilesRef = admin.firestore().doc(`userProfiles/${id}`);

							const updateUser = async () => {
								try {
									await userprofilesRef.update({
										subscribed: null,
										subscriptionDate: null,
										customUsernameColor: null,
									});
								} catch (error) {
									throw new Error(error);
								}
							};
							updateUser();
						});
					});

				break;
			default:
				// Unexpected event type
				console.log(`Unhandled event type ${event.type}.`);
		}

		// Return a 200 res to acknowledge receipt of the event
		res.send();
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
		.find('.css-1ti1acs')
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

	const htmlElement = $('.css-1ti1acs');

	$('.css-1ti1acs')
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

	const htmlElement = $('.css-1ti1acs');

	$('.css-1ti1acs')
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
 * Handles fetching the challenges from the forums RSS Feed
 * @returns
 */
const scrapeChallenges = async () => {
	const challenges = [];

	let feed = await parser.parseURL('https://forum.kerbalspaceprogram.com/forum/121-challenges-mission-ideas.xml/?member=169308&key=a55960987e65bf9880247b7deb6f43b3');
	const urlRegex = /(https?:\/\/[^\s"]+\.(?:png|jpg|jpeg|webm))/i;

	feed.items.forEach(challenge => {
		challenge.url = challenge.link;
		delete challenge.link;
		challenge.date = challenge.pubDate;
		delete challenge.pubDate;
		delete challenge.isoDate;
		challenge.articleId = challenge.guid;
		delete challenge.guid;
		delete challenge.message;

		const foundImages = challenge.content.match(urlRegex);
		const firstImageLink = foundImages ? foundImages[1] : null;
		if (firstImageLink) challenge.image = firstImageLink;
		challenges.push(challenge);
	});

	const dataJSON = challenges;
	return dataJSON;
};

/**
 * OLD - scrapes the website for challenges
 * @returns
 */
/*
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
*/
