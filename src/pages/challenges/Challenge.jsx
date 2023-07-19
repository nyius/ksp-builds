import React from 'react';
import { useParams } from 'react-router-dom';
import { useNewsContext } from '../../context/news/NewsContext';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import Spinner1 from '../../components/spinners/Spinner1';
import DeleteChallengeModal from '../../components/modals/DeleteChallengeModal';
import Helmet from '../../components/Helmet/Helmet';
import SubmitBuildChallengeBtn from './Components/Buttons/SubmitBuildChallengeBtn';
import ReadOriginalChallengeBtn from './Components/Buttons/ReadOriginalChallengeBtn';
import DeleteChallengeBtn from './Components/Buttons/DeleteChallengeBtn';
import ChallengeEditor from './Components/ChallengeEditor';
import ChallengeDescription from './Components/ChallengeDescription';
import { useGetChallenge, useSetChallengeArticle } from '../../context/news/NewsActions';

/**
 * Challenge Page
 * @returns
 */
function Challenge() {
	const { articlesLoading } = useNewsContext();
	const [challenge] = useGetChallenge(null);
	const [parsedArticle] = useSetChallengeArticle(null, challenge);
	const articleId = useParams().id;

	//---------------------------------------------------------------------------------------------------//
	if (articlesLoading) return <Spinner1 />;

	if (!articlesLoading && !challenge) {
		return (
			<CantFind text="Oops... Can't find this challenge!">
				<Button color="btn-primary" text="Return Home" icon="left" type="ahref" href="/" />
			</CantFind>
		);
	}

	return (
		<>
			<Helmet title={challenge.title} pageLink={`https://kspbuilds.com/challenges/${articleId}`} image={challenge.image ? challenge.image : null} type="article" description={challenge.contentSnippet.slice(0, 150) + '...'} />

			<MiddleContainer>
				<div className="border-2 border-dashed border-slate-600 rounded-xl p-4 2k:p-8">
					<p className="text-2xl 2k:text-4xl font-black text-slate-100 mb-5 2k:mb-10 pixel-font text-center">{challenge.title}</p>
					<div className="flex flex-col gap-2">
						<ChallengeDescription challenge={challenge} />
						<ChallengeEditor parsedArticle={parsedArticle} />
					</div>
				</div>
				<div className="flex flex-row gap-2 2k:gap-4">
					<SubmitBuildChallengeBtn challengeId={challenge.articleId} />
					<DeleteChallengeBtn />
					<ReadOriginalChallengeBtn url={challenge.url} />
				</div>
			</MiddleContainer>

			<DeleteChallengeModal id={articleId} />
		</>
	);
}

export default Challenge;
