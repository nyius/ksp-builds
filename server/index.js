//👇🏻index.js
import express from 'express';
import cors from 'cors';
const app = express();
import cheerio from 'cheerio';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import buildUpload from './modules/buildUpload.js';

const PORT = 4000;

//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/rawBuilds', express.static('rawBuilds'));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'rawBuilds');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1025 * 50 },
});

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

// handles uploading the build file to the server and saving it
app.post('/buildUpload', async (req, res) => {
	const { build, id } = req.body;
	buildUpload(id, build);

	// fs.writeFile(`./rawBuilds/${id}.json`, build, err => {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		console.log(`File Saved!`);
	// 	}
	// });

	// const buf = Buffer.from(JSON.stringify(build));

	// var data = {
	// 	Bucket: process.env.S3_BUCKET,
	// 	Key: `${id}.json`,
	// 	Body: buf,
	// 	ContentEncoding: 'base64',
	// 	ContentType: 'application/json',
	// 	ACL: 'public-read',
	// };

	// s3.upload(data, function (err, data) {
	// 	if (err) {
	// 		console.log(err);
	// 		console.log('Error uploading data: ', data);
	// 	} else {
	// 		console.log('succesfully uploaded!');
	// 	}
	// });

	res.json({
		message: 'Request successful!',
		// buildUrl,
	});
});

// handles a user fetching a build from the server
app.get('/fetchBuild', async (req, res) => {
	const id = req.query.id;

	res.download(`./rawBuilds/${id}.json`);
});

// handles a deleting a build
app.get('/deleteBuild', async (req, res) => {
	const id = req.query.id;

	res.json({
		message: 'Deleted',
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
