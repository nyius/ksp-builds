//👇🏻index.js
import express from 'express';
import cors from 'cors';
const app = express();
import cheerio from 'cheerio';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import got from 'got';

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

// start server
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
