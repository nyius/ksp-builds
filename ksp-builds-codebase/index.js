const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cheerio = require('cheerio');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
	apiKey: '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',
});

const openai = new OpenAIApi(configuration);

/**
 * Function for communicating with openai
 * @param {*} text
 * @returns
 */
const GPTFunction = async text => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: text,
		temperature: 0.6,
		max_tokens: 250,
		top_p: 1,
		frequency_penalty: 1,
		presence_penalty: 1,
	});
	return response.data.choices[0].text;
};

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

exports.getGPT = functions.https.onCall(async (data, context) => {
	const prompt = data.prompt.replace('gpt:', '');
	try {
		const gptRes = await GPTFunction(prompt);
		functions.logger.log(gptRes);

		return {
			gptRes,
		};
	} catch (error) {
		functions.logger.log('ERROR FROM getGPT: ' + error);
	}
});
