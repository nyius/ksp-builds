//👇🏻index.js
const express = require('express');
const cors = require('cors');
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Gets the news articles
app.get('/news', async (req, res) => {
	const data = [];

	const newsData = await scrapeNews();
	const patchData = await scrapePatchNotes();
	const devData = await scrapeDevDiaries();

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

	// return 20 articles
	res.json({
		message: 'news',
		data: JSON.stringify(data.splice(0, 20)),
	});
});

// start server
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
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
