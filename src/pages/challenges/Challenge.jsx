import React, { useState, useEffect, useContext } from 'react';
import NewsContext from '../../context/news/NewsContext';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Button from '../../components/buttons/Button';

function Challenge() {
	const { challenges } = useContext(NewsContext);
	const [article, setArticle] = useState(null);
	const [parsedArticle, setParsedArticle] = useState(null);
	const params = useParams().id;

	useEffect(() => {
		setArticle(() => {
			const challengeArr = challenges.filter(challenge => {
				if (challenge.articleId === params) return challenge;
			});
			return challengeArr[0];
		});
	}, [challenges]);

	useEffect(() => {
		if (article) setParsedArticle(findAllByKey(article.article.model.article.richText.json, 'value'));
	}, [article]);

	const findAllByKey = (obj, keyToFind) => {
		return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind ? acc.concat(value) : typeof value === 'object' ? acc.concat(findAllByKey(value, keyToFind)) : acc), []);
	};

	//---------------------------------------------------------------------------------------------------//
	if (parsedArticle) {
		return (
			<>
				<Helmet>
					<meta charSet="utf-8" />
					<title>KSP Builds - {article.title}</title>
					<link rel="canonical" href={`https://kspbuilds.com/challenge/${params}`} />
				</Helmet>

				<MiddleContainer>
					<div className="flex flex-col lg:flex-row gap-5 2k:gap-10 items-center rounded-lg bg-base-900 mb-5 2k:mb-10 h-fit">
						<img src={article.image} alt={article.title} className="rounded-lg w-fit lg:max-w-4xl 2k:max-w-7xl shadow-lg" />
						<div className="flex flex-col gap-2 2k:gap-4 mr-5 2k:mr-10">
							<p className="text-4xl 2k:text-5xl font-bold text-center text-white mb-2 2k:mb-4">{article.title}</p>
							<p className="text-2xl 2k:text-3xl italic text-center text-slate-500">{article.date}</p>
						</div>
					</div>

					<Button type="ahref" href={article.url} target="_blank" text="Read original article" color="btn-primary" size="w-fit" icon="right" margin="mb-4 2k:mb-8" />
					{parsedArticle.map((section, i) => {
						return (
							<p key={i} className="text-2xl 2k:text-4xl">
								{section}
							</p>
						);
					})}
				</MiddleContainer>
			</>
		);
	}
}

export default Challenge;
