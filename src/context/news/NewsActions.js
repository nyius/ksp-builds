import { useNewsContext } from './NewsContext';
import { toast } from 'react-toastify';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useEffect, useState } from 'react';
import { useBuildsContext } from '../builds/BuildsContext';
import { useParams } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import { fetchPatchNotes } from './NewsUtils';
import errorReport from '../../utilities/errorReport';

/**
 * News actions
 * @returns
 */
function useNews() {
	const { dispatchNews } = useNewsContext();
	/**
	 * handles setting the news
	 */
	const setNews = news => {
		dispatchNews({
			type: 'SET_NEWS',
			payload: news,
		});
	};

	/**
	 * Handles setting the loading state
	 * @param {*} bool
	 */
	const setNewsLoading = bool => {
		dispatchNews({
			type: 'SET_ARTICLES_LOADING',
			payload: bool,
		});
	};

	/**
	 * Handles deleting a challenge
	 * @param {*} id
	 */
	const deleteChallenge = async id => {
		try {
			await deleteDoc(doc(db, 'challenges', id));
			toast.success('Deleted challenge.');
		} catch (error) {
			toast.error('Something went wrong deleting that challenge');
			errorReport(error.message, false, 'deleteChallenge');
		}
	};

	/**
	 * Handles deleting a article
	 * @param {*} id
	 */
	const deleteArticle = async id => {
		try {
			await deleteDoc(doc(db, 'articles', id));
			toast.success('Deleted article.');
		} catch (error) {
			toast.error('Something went wrong deleting that article');
			errorReport(error.message, false, 'deleteChallenge');
		}
	};

	return { setNews, setNewsLoading, deleteChallenge, deleteArticle };
}

export default useNews;

/**
 * Returns the slides for the hero slider.
 * Generaes the slides from the loaded challenges, articles, and build of the week.
 * Sorts them by date.
 * @param {*} initialState
 * @returns [slides, setSlides]
 */
export const useSetHeroSlides = initialState => {
	const [slides, setSlides] = useState(initialState);
	const { challenges, articles, articlesLoading, dispatchNews } = useNewsContext();
	const { loadingBuildOfTheWeek, buildOfTheWeek } = useBuildsContext();

	// Add build of the week and challenges together
	useEffect(() => {
		if (!loadingBuildOfTheWeek && !articlesLoading) {
			const fullNewsArr = [...challenges, ...articles];
			if (buildOfTheWeek) fullNewsArr.push(buildOfTheWeek);

			// Sort everything
			fullNewsArr.sort((a, b) => {
				let aDate, bDate;

				aDate = a.buildOfTheWeek ? new Date(a.buildOfTheWeek.seconds * 1000) : new Date(a.date);
				bDate = b.buildOfTheWeek ? new Date(b.buildOfTheWeek.seconds * 1000) : new Date(b.date);

				return aDate < bDate ? 1 : -1;
			});

			const newsArr = fullNewsArr.slice(0, 10);

			setHeroSlidesLength(dispatchNews, newsArr.length);
			setSlides(newsArr);
		}
	}, [articlesLoading, loadingBuildOfTheWeek, challenges, articles, buildOfTheWeek, dispatchNews]);

	return [slides, setSlides];
};

/**
 * Gets the current challenge from our fetched challenges array.
 * @param {*} initialState
 * @returns [challenge, setChallenge];
 */
export const useGetChallenge = initialState => {
	const { challenges } = useNewsContext();
	const [challenge, setChallenge] = useState(initialState);
	const articleId = useParams().id;

	useEffect(() => {
		setChallenge(() => {
			const challengeArr = challenges.filter(challenge => {
				if (challenge.articleId === articleId) return challenge;
			});
			return challengeArr[0];
		});
	}, [challenges]);

	return [challenge, setChallenge];
};

/**
 * Gets the current article from our fetched articles array.
 * @param {*} initialState
 * @returns [article, setArticle];
 */
export const useGetArticle = initialState => {
	const { articles } = useNewsContext();
	const [article, setArticle] = useState(initialState);
	const articleId = useParams().id;

	useEffect(() => {
		setArticle(() => {
			const articleArr = articles.filter(article => {
				if (article.articleId === articleId) return article;
			});
			return articleArr[0];
		});
	}, [articles]);

	return [article, setArticle];
};

/**
 * Returns a challenges parsed article.
 * @param {*} initialState
 * @param {*} challenge - the challenge we want to parse the article from
 * @returns
 */
export const useSetChallengeArticle = (initialState, challenge) => {
	const [parsedArticle, setParsedArticle] = useState(initialState);

	useEffect(() => {
		if (challenge && challenge.article) {
			setParsedArticle(EditorState.createWithContent(convertFromRaw(JSON.parse(challenge.article))));
		}
	}, [challenge]);

	return [parsedArticle, setParsedArticle];
};

/**
 * handles fetching the patch notes.
 * @returns [patchNotes, loading]
 */
export const useFetchPatchNotes = () => {
	const [patchNotes, setPatchNotes] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPatchNotes().then(patchNotes => {
			setPatchNotes(patchNotes);
			setLoading(false);
		});
	}, []);

	return [patchNotes, loading];
};

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
 * Handles setting the id of the patch note to delete in context
 * @param {function} dispatchNews - dispatch function
 * @param {string} id - id of the patch note to delete
 */
export const setDeletePatchNoteId = (dispatchNews, id) => {
	dispatchNews({
		type: 'SET_DELETE_PATCH_ID',
		payload: id,
	});
};

/**
 * Handles setting the id of the patch note to edit in context
 * @param {function} dispatchNews - dispatch function
 * @param {string/bool} id - id of the patch note to delete
 */
export const setEditingPatchNotes = (dispatchNews, id) => {
	dispatchNews({
		type: 'SET_EDITING_PATCH',
		payload: id,
	});
};

/**
 * Handles going to the next slide in the hero
 * @param {function} dispatchNews - dispatch function
 */
export const nextHeroSlide = dispatchNews => {
	dispatchNews({
		type: 'nextHeroSlide',
	});
};

/**
 * Handles going to the next slide in the hero
 * @param {function} dispatchNews - dispatch function
 */
export const prevHeroSlide = dispatchNews => {
	dispatchNews({
		type: 'prevHeroSlide',
	});
};

/**
 * Handles going to the next slide in the hero
 * @param {function} dispatchNews - dispatch function
 */
export const setHeroSlide = (dispatchNews, i) => {
	dispatchNews({
		type: 'setHeroSlide',
		payload: i,
	});
};

/**
 * Handles setting the id of the patch note to edit in context
 * @param {function} dispatchNews - dispatch function
 * @param {int} length - length of the hero slides
 */
export const setHeroSlidesLength = (dispatchNews, length) => {
	dispatchNews({
		type: 'SET_HERO_SLIDES_LENGTH',
		payload: length,
	});
};
