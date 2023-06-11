import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
//---------------------------------------------------------------------------------------------------//
import NewsContext from '../../context/news/NewsContext';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import Spinner1 from '../../components/spinners/Spinner1';
import DeleteChallengeModal from '../../components/modals/DeleteChallengeModal';
import Helmet from '../../components/Helmet/Helmet';
import findAllByKey from '../../utilities/findAllByKey';
import SubmitBuildChallengeBtn from './Components/Buttons/SubmitBuildChallengeBtn';
import ReadOriginalChallengeBtn from './Components/Buttons/ReadOriginalChallengeBtn';
import DeleteChallengeBtn from './Components/Buttons/DeleteChallengeBtn';
import ChallengeEditor from './Components/ChallengeEditor';
import ChallengeDescription from './Components/ChallengeDescription';
import ChallengeHero from './Components/ChallengeHero';

/**
 * Challenge Page
 * @returns
 */
function Challenge() {
	const { challenges, articlesLoading } = useContext(NewsContext);
	//---------------------------------------------------------------------------------------------------//
	const [parsedArticle, setParsedArticle] = useState(null);
	const [challenge, setChallenge] = useState(null);
	//---------------------------------------------------------------------------------------------------//
	const params = useParams().id;

	useEffect(() => {
		setChallenge(() => {
			const challengeArr = challenges.filter(challenge => {
				if (challenge.articleId === params) return challenge;
			});
			return challengeArr[0];
		});
	}, [challenges]);

	useEffect(() => {
		if (challenge) {
			if (challenge.article.model) {
				setParsedArticle(findAllByKey(challenge.article.model.article.richText.json, 'value'));
			} else {
				setParsedArticle(EditorState.createWithContent(convertFromRaw(JSON.parse(challenge.article))));
			}
		}
	}, [challenge]);

	if (articlesLoading) return <Spinner1 />;

	if (!articlesLoading && !challenge) {
		return (
			<CantFind text="Oops... Can't find this challenge!">
				<Button color="btn-primary" text="Return Home" icon="left" type="ahref" href="/" />
			</CantFind>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	if (parsedArticle) {
		return (
			<>
				<Helmet title={challenge.title} pageLink={`https://kspbuilds.com/challenges/${params}`} />

				<MiddleContainer>
					<DeleteChallengeBtn />
					<ChallengeHero challenge={challenge} />

					<ReadOriginalChallengeBtn url={challenge.url} />

					<div className="border-2 border-dashed border-slate-600 rounded-xl p-4 2k:p-8">
						<p className="text-2xl 2k:text-4xl font-black text-slate-300 mb-5 2k:mb-10">CHALLENGE</p>
						<div className="flex flex-col gap-2">
							<ChallengeDescription rawChallenge={challenge} parsedChallenge={parsedArticle} />
							<ChallengeEditor parsedArticle={parsedArticle} />
						</div>
					</div>
					<SubmitBuildChallengeBtn challengeId={challenge.articleId} />
				</MiddleContainer>

				<DeleteChallengeModal id={params} />
			</>
		);
	}
}

export default Challenge;
