const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cheerio = require('cheerio');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

admin.initializeApp();

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
				type: 'Challenge',
				url: 'https://www.kerbalspaceprogram.com/challenges',
			};

			articles.push(article);
		});
	const dataJSON = articles;
	return dataJSON;
};
