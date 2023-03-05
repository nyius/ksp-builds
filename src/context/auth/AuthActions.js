import { db } from '../../firebase.config';
import { updateDoc, doc, collection } from 'firebase/firestore';
import { useContext } from 'react';
import AuthContext from './AuthContext';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';

const useAuth = () => {
	const { dispatchAuth, user, newUsername, newBio, editingProfile, verifyChangeUsername } = useContext(AuthContext);

	/**
	 * handles dispatching the new username to the context
	 * @param {*} newValue
	 */
	const setNewUsername = newValue => {
		dispatchAuth({ type: 'SET_NEW_USERNAME', payload: newValue });
	};

	/**
	 * Handles when a user signs up with google and neeeds to enter a username
	 * @param {*} value
	 */
	const setNewGoogleSignup = value => {
		dispatchAuth({ type: 'SET_NEW_GOOGLE_SIGNUP', payload: value });
	};

	/**
	 * Handles updating the users state
	 * @param {*} update
	 */
	const updateUserState = update => {
		dispatchAuth({ type: 'UPDATE_USER', payload: update });
	};

	/**
	 * Handles updating the user on the DB
	 * @param {*} update
	 */
	const updateUserDb = async update => {
		try {
			await updateDoc(doc(db, 'users', user.uid), update);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles updating the users voting on the server. Updates the builds vote count and the current users voted
	 * @param {*} type
	 * @param {*} build
	 */
	const handleVoting = async (type, build) => {
		try {
			let newUpVotes = cloneDeep(user.upVotes);
			let newDownVotes = cloneDeep(user.downVotes);

			if (type === 'upVote') {
				// Check if we already upvoted this (and if so, unupvote it)
				if (newUpVotes.includes(build.id)) {
					const index = newUpVotes.indexOf(build.id);
					newUpVotes.splice(index, 1);

					dispatchAuth({ type: 'UPDATE_USER', payload: { upVotes: newUpVotes } });

					updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, 'builds', build.id), { upVotes: (build.upVotes -= 1) });
				} else {
					newUpVotes.push(build.id);
					dispatchAuth({ type: 'UPDATE_USER', payload: { upVotes: newUpVotes } });

					updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, 'builds', build.id), { upVotes: (build.upVotes += 1) });

					// If the user has this downvoted but wants to upvote it, remove the downvote
					if (newDownVotes.includes(build.id)) {
						const index = newDownVotes.indexOf(build.id);
						newDownVotes.splice(index, 1);

						dispatchAuth({ type: 'UPDATE_USER', payload: { downVotes: newDownVotes } });

						updateUserDb({ downVotes: newDownVotes });
						await updateDoc(doc(db, 'builds', build.id), { downVotes: (build.downVotes -= 1) });
					}
				}
			}
			if (type === 'downVote') {
				// Check if we already downvoted this (and if so, undownvote it)
				if (newDownVotes.includes(build.id)) {
					const index = newDownVotes.indexOf(build.id);
					newDownVotes.splice(index, 1);

					dispatchAuth({ type: 'UPDATE_USER', payload: { downVotes: newDownVotes } });

					updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, 'builds', build.id), { downVotes: (build.downVotes -= 1) });
				} else {
					newDownVotes.push(build.id);
					dispatchAuth({ type: 'UPDATE_USER', payload: { downVotes: newDownVotes } });

					updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, 'builds', build.id), { downVotes: (build.downVotes += 1) });

					// If the user has this downvoted but wants to downvote it, remove the upvote
					if (newUpVotes.includes(build.id)) {
						const index = newUpVotes.indexOf(build.id);
						newUpVotes.splice(index, 1);

						dispatchAuth({ type: 'UPDATE_USER', payload: { upVotes: newUpVotes } });

						updateUserDb({ upVotes: newUpVotes });
						await updateDoc(doc(db, 'builds', build.id), { upVotes: (build.downVotes -= 1) });
					}
				}
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong D:');
		}
	};

	/**
	 * Handles adding a new build to the current users state. takes in a build id
	 * @param {*} buildId
	 */
	const addbuildToUser = buildId => {
		dispatchAuth({ type: 'ADD_BUILD', payload: buildId });
	};

	return { setNewGoogleSignup, updateUserState, handleVoting, addbuildToUser };
};

export default useAuth;
