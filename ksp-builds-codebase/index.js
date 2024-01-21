const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();
const firestore = require('firebase/firestore');
const axios = require('axios');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
admin.initializeApp();
const { TwitterApi } = require('twitter-api-v2');
const { firebase } = require('googleapis/build/src/apis/firebase');
const Parser = require('rss-parser');
let parser = new Parser();
//Stripe -------------------------------------------------------------------------------------------------------------------------------------------------//
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET);
const endpointSecret = process.env.REACT_APP_STRIPE_SUCCESS_ENDPOINT_PROD;
// const endpointSecret = 'whsec_ba90833eb62f59831b3b58cd308b311dbeee87a326899886ccdeb196e450e96d';

// For Google Login ------------------------------------------------------------------------------------------------------------------------------------------ //
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const session = require('express-session');

//This eliminates retry even on wake (surprisingly)
function initialRequest() {
	const req = http.request({ hostname: '127.0.0.1', port: 8080, path: '/', method: 'GET' });
	req.end();
}
initialRequest();

const PROTOCOL = process.env.PROTOCOL || 'http',
	PORT = parseInt(process.env.PORT || 3002),
	RETURN_HOST = process.env.RETURN_HOST || `localhost:${PORT}`,
	SUBDIR = process.env.SUBDIR || '/google';

// Get your Google app's client ID & secret from environment variables, these
// can also be set in an .env file
// You can obtain your client ID & secret at https://console.cloud.google.com/apis/dashboard
const AUTH_SCOPE = ['profile'];

const socketConnections = new Map(),
	usersStore = new Map();

const googleStrategy = new GoogleStrategy(
	{
		clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
		callbackURL: `${PROTOCOL}://${RETURN_HOST}${SUBDIR}/auth/return`,
	},
	(accessToken, refreshToken, profile, done) => {
		done(null, {
			...profile,
			googleAccessToken: accessToken,
			googleRefreshToken: refreshToken,
		});
	}
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((userSerialized, done) => {
	done(null, userSerialized);
});

passport.use('google', googleStrategy);

const sessionParser = session({
	secret: 'google ow login',
	name: 'sid',
	resave: false,
	saveUninitialized: false,
});

const loginServerApp = express(),
	// server = http.createServer(loginServerApp),
	// wss = new WebSocket.Server({ clientTracking: false, server });
	wss = new WebSocket.Server({ clientTracking: false, noServer: true });

loginServerApp.use(sessionParser);

// Initialize Passport! Also use passport.session() middleware, to support
// persistent login sessions (recommended).
loginServerApp.use(passport.initialize());
loginServerApp.use(passport.session());

// Format JSON output in a nice way
loginServerApp.set('json spaces', 2);

// Gets Google User (if user is arleady logged in) --------------------------------------------------------------------------------------------
loginServerApp.get(`${SUBDIR}/get-user`, async (req, res) => {
	const sessionId = req.query?.sessionId;

	if (!sessionId) {
		res.sendStatus(401);
		return;
	}

	if (!usersStore.has(sessionId)) {
		res.sendStatus(404);
		return;
	}

	res.json(usersStore.get(sessionId));
});

// Log out --------------------------------------------------------------------------------------------
loginServerApp.get(`${SUBDIR}/logout`, (req, res) => {
	req.logout();

	const sessionId = req.query?.sessionId;

	if (sessionId) {
		socketConnections.delete(sessionId);
		usersStore.delete(sessionId);
	}

	res.redirect('/');
});

// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Google authentication will involve redirecting
// the user to google.com. After authenticating, Google will redirect the
// user back to this Application at /auth/steam/return
loginServerApp.get(
	`${SUBDIR}/auth`,
	(req, res, next) => {
		if (req.query?.sessionId && validateUUID(req.query?.sessionId) && socketConnections.has(req.query?.sessionId)) {
			req.session.sessionId = req.query.sessionId;
			next();
		} else {
			res.sendStatus(401);
		}
	},
	passport.authenticate('google', {
		scope: AUTH_SCOPE,
		failureRedirect: '/',
	}),
	(req, res) => res.redirect('/')
);

// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
loginServerApp.get(
	`${SUBDIR}/auth/return`,
	(req, res, next) => {
		if (req.session?.sessionId && validateUUID(req.session?.sessionId) && socketConnections.has(req.session?.sessionId)) {
			next();
		} else {
			res.sendStatus(401);
		}
	},
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		if (!req.isAuthenticated()) {
			res.sendStatus(401);
			return;
		}

		const ws = socketConnections.get(req.session.sessionId);

		if (!ws) {
			res.sendStatus(401);
			return;
		}

		usersStore.set(req.session.sessionId, req.user);

		ws.send(
			JSON.stringify({
				messageType: 'login',
				user: req.user,
			})
		);

		res.redirect(`${SUBDIR}/auth/success`);

		ws.close();
	}
);

loginServerApp.get(`${SUBDIR}/auth/success`, (req, res) => {
	res.send(`Logged in successfully, see message in Overwolf loginServerApp's console`);
});

wss.on('connection', ws => {
	const sessionId = uuid();

	functions.logger.log(`Websocket client ${sessionId} connected`);

	ws.send(
		JSON.stringify({
			messageType: 'sessionId',
			sessionId,
		})
	);

	socketConnections.set(sessionId, ws);

	ws.on('message', message => {
		functions.logger.log(`message from client ${sessionId}:`, message);
	});

	ws.on('close', () => {
		functions.logger.log(`websocket client ${sessionId} disconnected`);
		socketConnections.delete(sessionId);
	});
});

exports.loginServerApp = functions.https.onRequest((req, res) => {
	const reqServer = req.socket.server;
	if (reqServer === server) return;
	server = reqServer;

	server.on('upgrade', (request, socket, head) => {
		wss.handleUpgrade(request, socket, head, ws => {
			wss.emit('connection', ws, request);
		});
	});

	// server.emit("request", req, res); // this is not sufficient
	res.setHeader('Retry-After', 0).status(503).send('Websockets now ready');
});

// exports.loginServerApp = functions.https.onRequest(loginServerApp);

// Amazon S3 Client ------------------------------------------------------------------------------------------------------------------------------------------
const s3Client = new S3Client({
	apiVersion: 'latest',
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
	},
});

// Gets the news articles
exports.scrapeNews = functions.pubsub.schedule('0 * * * *').onRun(async context => {
	try {
		// every hour '0 * * * *'
		const data = [];

		const newsData = await scrapeKspNews();
		const patchData = await scrapeKspPatchNotes();
		const devData = await scrapeKspDevDiaries();
		const challengesData = await scrapeKspChallenges();

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
		const data = [];
		const challenges = [];

		const newsData = await scrapeKspNews();
		const patchData = await scrapeKspPatchNotes();
		const devData = await scrapeKspDevDiaries();
		const challengesData = await scrapeKspChallenges();

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
		const newChallenges = await scrapeKspChallenges();
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
				functions.logger.log(`⚠️  Webhook signature verification failed. ${err.message}`);
				return res.sendStatus(400);
			}
		}

		// Handle the event
		switch (event.type) {
			case 'payment_intent.succeeded':
				functions.logger.log(`Payment Intent Succeeded`);
				const paymentIntent = event.data.object;
				break;
			case 'checkout.session.async_payment_succeeded':
				functions.logger.log(`Async payment succeeded`);
				const checkoutSessionAsyncPaymentSucceeded = event.data.object;
			case 'customer.subscription.created':
				functions.logger.log(`Subscription created`);
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
				functions.logger.log(`Unhandled event type ${event.type}.`);
		}

		// Return a 200 res to acknowledge receipt of the event
		res.send();
	} catch (error) {
		functions.logger.log(error);
	}
});

/**
 * Gets live ksp streams for KSP 1 and KSP 2
 */
exports.fetchLiveKspStreams = functions.pubsub.schedule('every 1 minutes').onRun(async (req, res) => {
	try {
		const newToken = await axios
			.post(
				'https://id.twitch.tv/oauth2/token',
				{
					client_id: process.env.REACT_APP_TWITCH_ID,
					client_secret: process.env.REACT_APP_TWITCH_SECRET,
					grant_type: 'client_credentials',
				},
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			)
			.then(async newToken => {
				return newToken.data.access_token;
			})
			.catch(err => {
				throw new Error(`Error from exios in getting new token: ${err}`);
			});

		await axios
			.get(`https://api.twitch.tv/helix/streams?game_id=${process.env.REACT_APP_TWITCH_KSP2_ID}`, {
				headers: {
					Authorization: `Bearer ${newToken}`,
					'Client-Id': process.env.REACT_APP_TWITCH_ID,
				},
			})
			.then(liveStreams => {
				const saveLiveStreams = new PutObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `liveKspStreams.json`,
					Body: JSON.stringify(liveStreams.data),
					ContentEncoding: 'base64',
					ContentType: 'application/json',
					ACL: 'public-read',
				});

				s3Client.send(saveLiveStreams);
			})
			.catch(async err => {
				if (err?.response?.data?.status == 401) {
					throw new Error(`Something went wrong with authenticating: ${err}`);
				} else {
					throw new Error(`Something went wrong fetching streams ${err}`);
				}
			});
	} catch (error) {
		functions.logger.log(error);
		res.status(404).send(`Something went wrong fetching streams ${error}`);
	}
});

/**
 * Gets live ksp streams for KSP 1 and KSP 2
 */
exports.checkAccountBirthdays = functions.pubsub.schedule('0 0 * * *').onRun(async (req, res) => {
	try {
		const today = new Date();
		const todayMonth = today.getUTCMonth() + 1; // Months are zero-indexed
		const todayDay = today.getUTCDate();

		// Query users with the same birth month and day
		const usersSnapshot = await firestore.collection('users').where('accountBirthMonth', '==', todayMonth).where('accountBirthDay', '==', todayDay).get();

		// Give awards or take the desired action for each user
		usersSnapshot.forEach(userDoc => {
			const userData = userDoc.data();
			// Give the user an award or take the desired action
			console.log(`Happy Birthday, ${userData.username}! You've received an award.`);
			// Add logic here to give an award
		});
	} catch (error) {
		functions.logger.log(error);
		res.status(404).send(`Something went wrong fetching streams ${error}`);
	}
});

//--------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------//
/**
 * Handles scraping the KSP website for patch notes
 * @returns
 */
const scrapeKspPatchNotes = async () => {
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
const scrapeKspDevDiaries = async () => {
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
const scrapeKspChallenges = async () => {
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
 * Handles fetching the news from the forums RSS Feed
 * @returns
 */
const scrapeKspNews = async () => {
	const news = [];

	let feed = await parser.parseURL('https://forum.kerbalspaceprogram.com/forum/139-ksp2-dev-updates.xml/?member=169308&key=a55960987e65bf9880247b7deb6f43b3');
	const urlRegex = /(https?:\/\/[^\s"]+\.(?:png|jpg|jpeg|webm))/i;

	feed.items.forEach(article => {
		article.url = article.link;
		delete article.link;
		article.date = article.pubDate;
		delete article.pubDate;
		delete article.isoDate;
		article.articleId = article.guid;
		delete article.guid;
		delete article.message;

		const foundImages = article.content.match(urlRegex);
		const firstImageLink = foundImages ? foundImages[1] : null;
		if (firstImageLink) article.image = firstImageLink;
		news.push(article);
	});

	const dataJSON = news;
	return dataJSON;
};
