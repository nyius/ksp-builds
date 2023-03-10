export default async function handler(req, res) {
	console.log(`first`);
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

	// Gets the news articles
	const data = await performScraping();
	res.json({
		message: 'news',
		data,
	});
}
