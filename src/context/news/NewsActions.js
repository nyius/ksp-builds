import React, { useContext } from 'react';
import NewsContext from './NewsContext';
import { toast } from 'react-toastify';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

function useNews() {
	const { dispatchNews } = useContext(NewsContext);
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
			console.log(error);
		}
	};

	return { setNews, setNewsLoading, deleteChallenge };
}

export default useNews;

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
