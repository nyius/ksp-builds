import { useContext } from 'react';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
//---------------------------------------------------------------------------------------------------//
import BuildContext from './BuildContext';
import BuildsContext from '../builds/BuildsContext';
import AuthContext from '../auth/AuthContext';
import FiltersContext from '../filters/FiltersContext';
import { clonedeep } from 'lodash';
//---------------------------------------------------------------------------------------------------//
import { toast } from 'react-toastify';

const useBuild = () => {
	const { dispatchBuild, deletingBuild, deletingBuildId, deletingCommentId, comments, loadedBuild, comment } = useContext(BuildContext);
	const { fetchedBuilds, dispatchBuilds } = useContext(BuildsContext);
	const { user } = useContext(AuthContext);

	/**
	 * Fetches the build from the server and dispatches the result.
	 * @param {*} id
	 */
	const fetchBuild = async id => {
		dispatchBuild({ type: 'LOADING_BUILD', payload: true });

		try {
			const ref = doc(db, 'builds', id);
			const data = await getDoc(ref);

			if (data.exists()) {
				dispatchBuild({ type: 'SET_BUILD', payload: { loadedBuild: data.data(), loadingBuild: false } });
			} else {
				toast.error("Couldn't find that build!");
				throw new Error("Couldn't find that build!");
			}
		} catch (error) {
			console.log(error);
			throw new Error(`Error fetching build: ${error}`);
		}
	};

	/**
	 * Hadles saving the new build to the server
	 */
	const makeBuildReadyToUpload = async () => {
		try {
			dispatchBuild({
				type: 'UPLOADING_BUILD',
				payload: true,
			});

			// Check if we have a build name
			if (loadedBuild.name.length === 0) {
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				toast.error('Please enter a build name');
				throw new Error('Please enter a build name');
			}

			// Check if user is logged in
			if (!user) {
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				toast.error('Please log in or create an account to save a build');
				throw new Error('Not logged in');
			}

			// Check if theres cards in the build
			if (loadedBuild.type === '') {
				toast.error('You forgot to give your build a type!');
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('You forgot to give your build a type!');
			}

			// Check description length
			if (loadedBuild.description.length > 500) {
				toast.error('Description too long');
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('Description too long');
			}

			// Check name length
			if (loadedBuild.name.length > 100) {
				toast.error('Build name too long');
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('Build name too long');
			}

			return loadedBuild;
		} catch (error) {
			throw new Error(`Error in makeBuildReadyToUpload: ${error}`);
		}
	};

	/**
	 * Handles adding the build to the database
	 * @param {*}
	 */
	const addBuildToDb = async () => {
		try {
			const buildToUpload = await makeBuildReadyToUpload(loadedBuild);

			await addDoc(collection(db, 'builds'), buildToUpload)
				.then(newBuildLink => {
					dispatchBuild({
						type: 'UPLOADING_BUILD',
						payload: false,
					});

					const addIdToBuild = async () => {
						await updateDoc(doc(db, 'builds', newBuildLink.id), {
							id: newBuildLink.id,
						});
					};

					addIdToBuild();
					let newId;
					newId = newBuildLink.id;
					buildToUpload.id = newBuildLink.id;

					// handleFavorite(buildToUpload.id);

					return newBuildLink.id;
				})
				.catch(err => {
					dispatchBuild({
						type: 'UPLOADING_BUILD',
						payload: false,
					});
					throw Error(err);
				});
			return buildToUpload;
		} catch (error) {
			dispatchBuild({
				type: 'UPLOADING_BUILD',
				payload: false,
			});
			throw new Error(`error in addBuildToDb: ${error}`);
		}
	};

	/**
	 * Handles updating the build in the database
	 * @param {*} ()
	 */
	const updateBuild = async () => {
		try {
			const newBuild = await makeBuildReadyToUpload(loadedBuild);

			await updateDoc(doc(db, 'builds', newBuild.id), {
				...newBuild,
			})
				.then(() => {
					dispatchBuild({
						type: 'SET_BUILD',
						payload: {
							savingBuild: false,
							editingBuild: false,
						},
					});

					toast.success('Build updated');
				})
				.catch(err => {
					setSavingBuild(false);
					throw new Error(err);
				});
		} catch (error) {
			setSavingBuild(false);
			throw new Error(error);
		}
	};

	/**
	 * Handles setting deleting a build
	 * @param {*} id
	 */
	const setDeletingBuild = id => {
		dispatchBuild({
			type: 'SET_BUILD',
			payload: { deletingBuild: !deletingBuild, deletingBuildId: id },
		});
	};

	/**
	 * handles deleting a build
	 */
	const deleteBuild = async id => {
		try {
			if (!id) return;
			console.log(id);
			// Delete the comments
			const commentsQuery = query(collection(db, 'builds', id, 'comments'));
			const commentsQuerySnapshot = await getDocs(commentsQuery);
			commentsQuerySnapshot.forEach(comment => {
				deleteDoc(doc(db, 'builds', id, 'comments', comment.id));
			});

			// Delete the build
			await deleteDoc(doc(db, 'builds', id))
				.then(() => {
					// Filter the deleted build out of the loaded builds
					dispatchBuilds({
						type: 'DELETE_BUILD',
						payload: id,
					});

					setDeletingBuild(dispatchBuild);
					toast.success(`Build Deleted!`);
				})
				.catch(err => {
					setDeletingBuild(dispatchBuild);
					toast.error(`Something went wrong deleting the build`);
					throw new Error(err);
				});
		} catch (error) {
			setDeletingBuild(dispatchBuild);
			throw new Error(error);
		}
	};

	/**
	 * Handles setting up deleting a comment
	 * @param {*} type (delete, cancel)
	 */
	const setDeletingComment = (commentId, type) => {
		if (type === 'delete') {
			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					deletingComment: true,
					deletingCommentId: commentId,
				},
			});
		} else if (type === 'cancel') {
			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					deletingComment: false,
					deletingCommentId: '',
				},
			});
		}
	};

	/**
	 * handles deleting a build
	 * @param {*} buildId
	 */
	const deleteComment = async buildId => {
		try {
			// Delete the comments
			await deleteDoc(doc(db, 'builds', buildId, 'comments', deletingCommentId))
				.then(() => {
					//Filter the deleted comment from the comments array
					const newComments = comments.filter(comment => comment.id !== deletingCommentId);

					dispatchBuild({
						type: 'SET_BUILD',
						payload: {
							deletingComment: false,
							deletingCommentId: '',
							comments: newComments,
						},
					});

					toast.success('Comment deleted');
				})
				.catch(err => {
					dispatchBuild({
						type: 'SET_BUILD',
						payload: {
							deletingComment: false,
							deletingCommentId: '',
						},
					});
					toast.error(`Something went wrong deleting the comment`);
					throw new Error(err);
				});
		} catch (error) {
			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					deletingComment: false,
					deletingCommentId: '',
				},
			});
			throw new Error(error);
		}
	};

	/**
	 * Fetches a builds comments
	 * @param {*} id a builds Id
	 */
	const fetchComments = async () => {
		try {
			if (loadedBuild?.id) {
				const commentsRef = collection(db, 'builds', loadedBuild.id, 'comments');
				const commentsSnapshot = await getDocs(commentsRef);
				const commentsList = commentsSnapshot.docs.map(doc => {
					const comment = doc.data();
					comment.id = doc.id;
					return comment;
				});

				if (commentsList) commentsList.sort((a, b) => b.timestamp - a.timestamp);

				dispatchBuild({
					type: 'SET_BUILD',
					payload: { comments: commentsList, commentsLoading: false },
				});
			}
		} catch (error) {
			console.log(error);
			dispatchBuild({
				type: 'SET_BUILD',
				payload: { commentsLoading: false },
			});
			throw new Error(`Error fetching comments: ${error}`);
		}
	};

	/**
	 * Handles setting saving build state
	 * @param {*} value
	 */
	const setSavingBuild = value => {
		dispatchBuild({
			type: 'SAVING_BUILD',
			payload: value,
		});
	};

	/**
	 * Handles cancelling a build edit. Reverts it to prev state
	 * @param {*} build
	 */
	const cancelBuilEdit = backupBuild => {
		dispatchBuild({
			type: 'SET_BUILD',
			payload: {
				editingBuild: false,
				cancelEdit: false,
				loadedBuild: clonedeep(backupBuild),
			},
		});
	};

	/**
	 * Handles setting cancelling a build edit
	 * @param {*} value
	 */
	const setCancelEdit = value => {
		dispatchBuild({
			type: 'SET_BUILD',
			payload: {
				cancelEdit: value,
			},
		});
	};

	/**
	 * Resets the build state
	 */
	const setBaseBuild = () => {
		dispatchBuild({
			type: 'SET_BUILD',
			payload: {
				editingBuild: true,
				loadingBuild: false,
			},
		});
	};

	/**
	 * Handles adding a new comment
	 */
	const addComment = async () => {
		try {
			if (!comment || comment?.length === 0) {
				throw new Error('Comment cannot be empty');
			}

			const postRef = collection(db, 'builds', loadedBuild.id, 'comments');

			// Create the comment for the DB
			const newComment = {
				comment: comment,
				profilePicture: user.profilePicture,
				timestamp: new Date(),
				username: user.username,
				uid: user.uid,
			};

			// Add it to the DB
			const newId = await addDoc(postRef, newComment);

			newComment.id = newId.id;

			// Update the comment count on the build list
			const update = doc(db, 'builds', loadedBuild.id);
			await updateDoc(update, {
				comments: (loadedBuild.comments += 1),
			});

			// Send a notification to the build author
			if (loadedBuild.uid !== user.uid) {
				const authorRef = collection(db, 'users', loadedBuild.uid, 'notifications');

				const newNotification = {
					buildId: loadedBuild.id,
					buildName: loadedBuild.name,
					type: 'comment',
					uid: user.uid,
					username: user.username,
					timestamp: new Date(),
					profilePicture: user.profilePicture,
					comment: comment,
					commentId: newId.id,
					read: false,
				};

				await addDoc(authorRef, newNotification);
			}

			toast.success('Commented!');

			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					comment: '',
					comments: [newComment, ...comments],
				},
			});
		} catch (error) {
			toast.error('Something went wrong commenting.');
			throw new Error(error);
		}
	};

	/**
	 * Handles setting a comment while writing
	 * @param {*} e
	 */
	const setComment = comment => {
		dispatchBuild({
			type: 'SET_BUILD',
			payload: {
				comment: comment,
			},
		});
	};

	/**
	 * Handles a user editing a comment
	 * @param {*} value
	 */
	const setEditingComment = value => {
		dispatchBuild({
			type: 'SET_BUILD',
			payload: {
				editingComment: value,
			},
		});
	};

	return {
		setBaseBuild,
		setCancelEdit,
		cancelBuilEdit,
		setSavingBuild,
		fetchComments,
		deleteComment,
		setDeletingComment,
		deleteBuild,
		setDeletingBuild,
		updateBuild,
		addBuildToDb,
		makeBuildReadyToUpload,
		fetchBuild,
		addComment,
		setComment,
		setEditingComment,
	};
};

export default useBuild;
