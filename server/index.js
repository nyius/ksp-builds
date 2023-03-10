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
	const data = await performScraping();
	res.json({
		message: 'news',
		data,
	});
});

// start server
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

/**
 * Handles scraping the KSP website for articles
 * @returns
 */
const performScraping = async () => {
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
				url: 'https://www.kerbalspaceprogram.com/news',
			};

			articles.push(article);
		});
	const dataJSON = JSON.stringify(articles);
	return dataJSON;
};
