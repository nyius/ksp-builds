import React, { useState, useEffect, useContext } from 'react';
import NewsContext from '../../context/news/NewsContext';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import { useNavigate } from 'react-router-dom';

function Challenge() {
	const { challenges } = useContext(NewsContext);
	const [article, setArticle] = useState(null);
	const [parsedArticle, setParsedArticle] = useState(null);
	//---------------------------------------------------------------------------------------------------//
	const params = useParams().id;
	const navigate = useNavigate();

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

	if (!article)
		return (
			<CantFind text="Oops... Can't find this challenge!">
				<Button color="btn-primary" text="Return Home" icon="left" type="ahref" href="/" />
			</CantFind>
		);

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
							<p className="text-4xl 2k:text-5xl font-bold text-center lg:text-left text-white mb-2 2k:mb-4">{article.title}</p>
							<p className="text-2xl 2k:text-3xl italic text-center lg:text-left text-slate-500">{article.date}</p>
						</div>
					</div>

					<Button type="ahref" href={article.url} target="_blank" text="Read original article" color="bg-base-900" size="w-fit" icon="right" margin="mb-10 2k:mb-20" />
					<div className="border-2 border-dashed border-slate-600 rounded-xl p-4 2k:p-8">
						<p className="text-2xl 2k:text-4xl font-black text-slate-300 mb-5 2k:mb-10">CHALLENGE</p>
						<div className="flex flex-col gap-2">
							{parsedArticle.map((section, i) => {
								return (
									<p key={i} className="text-xl 2k:text-3xl">
										{section}
									</p>
								);
							})}
						</div>
					</div>

					<Button type="ahref" href={`/upload/c=${article.articleId}`} text="Submit Build" icon="plus" color="btn-accent" position="z-50" size="w-fit" margin="mt-10 2k:mt-20" />
				</MiddleContainer>
			</>
		);
	}
}

export default Challenge;
