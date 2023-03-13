import React, { useEffect, useState } from 'react';
import NewsCard from '../../news/NewsCard';
import { s3Client } from '../../../S3.config';
import { GetObjectCommand } from '@aws-sdk/client-s3';

function RightBar() {
	const [news, setNews] = useState([]);

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const command = new GetObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `kspNews.json`,
				});

				let response = await s3Client.send(command);
				let rawNews = await response.Body.transformToString();
				let parsedNews = JSON.parse(rawNews);
				setNews(parsedNews);
			} catch (error) {
				console.log(error);
			}
		};

		fetchNews();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="sidebar-right z-50 bg-base-800 rounded-xl p-6 2k:p-8 h-screen overflow-auto scrollbar fixed left-bar">
			<h1 className="text-2xl 2k:text-4xl text-slate-100 font-bold mb-2 2k:mb-8 text-center">KSP2 News</h1>
			<div className="flex flex-col gap-10 2k:gap-20">
				{news.map((article, i) => {
					return <NewsCard key={i} article={article} />;
				})}
			</div>
		</div>
	);
}

export default RightBar;
