import React from 'react';
import { useNewsContext } from '../../context/news/NewsContext';
import { useGetArticle, useSetChallengeArticle } from '../../context/news/NewsActions';
import Button from '../../components/buttons/Button';
import Spinner2 from '../../components/spinners/Spinner2';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Helmet from '../../components/Helmet/Helmet';
import { useParams } from 'react-router-dom';
import DeleteArticleBtn from './Components/Buttons/DeleteArticleBtn';
import ArticleDescription from './Components/ArticleDescription';
import ArticleEditor from './Components/ArticleEditor';
import DeleteArticleModal from '../../components/modals/DeleteArticleModal';

/**
 * Challenge Page
 * @returns
 */
function Article() {
	const { articlesLoading } = useNewsContext();
	const [article] = useGetArticle(null);
	const [parsedArticle] = useSetChallengeArticle(null, article);
	const articleId = useParams().id;

	//---------------------------------------------------------------------------------------------------//
	if (articlesLoading) return <Spinner2 />;

	if (!articlesLoading && !article) {
		return (
			<CantFind text="Oops... Can't find this article!">
				<Button color="btn-primary" text="Return Home" icon="left" type="ahref" href="/" />
			</CantFind>
		);
	}

	return (
		<>
			<Helmet title={article.title} pageLink={`https://kspbuilds.com/news/${articleId}`} image={article.image ? article.image : null} type="article" />

			<MiddleContainer>
				<div className="border-2 border-dashed border-slate-600 rounded-xl p-4 2k:p-8">
					<p className="text-2xl 2k:text-4xl font-black text-slate-100 mb-5 2k:mb-10 pixel-font text-center">{article.title}</p>
					<div className="flex flex-col gap-2">
						<ArticleDescription article={article.content} />
						<ArticleEditor parsedArticle={parsedArticle} />
					</div>
				</div>
				<div className="flex flex-row gap-2 2k:gap-4">
					<DeleteArticleBtn />
				</div>
			</MiddleContainer>

			<DeleteArticleModal id={articleId} />
		</>
	);
}
export default Article;
