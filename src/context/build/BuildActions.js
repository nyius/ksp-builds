import { useContext } from 'react';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { clonedeep } from 'lodash';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';
//---------------------------------------------------------------------------------------------------//
import BuildContext from './BuildContext';
import BuildsContext from '../builds/BuildsContext';
import AuthContext from '../auth/AuthContext';
import useAuth from '../auth/AuthActions';
import { profanity } from '@2toad/profanity';
//---------------------------------------------------------------------------------------------------//
import { toast } from 'react-toastify';

const useBuild = () => {
	const navigate = useNavigate();
	const { dispatchBuild, deletingCommentId, comments, loadedBuild, comment, editingBuild } = useContext(BuildContext);
	const { fetchedBuilds, dispatchBuilds } = useContext(BuildsContext);
	const { user } = useContext(AuthContext);
	const { updateUserState, addbuildToUser, handleVoting } = useAuth();

	/**
	 * Fetches the build from the server and dispatches the result.
	 * @param {*} id
	 */
	const fetchBuild = async id => {
		dispatchBuild({ type: 'LOADING_BUILD', payload: true });

		try {
			const buildRef = doc(db, 'builds', id);
			let response, rawBuildData, parsedBuild;

			// get the build from the db
			const fetchedBuild = await getDoc(buildRef);

			// Get the raw build from aws
			try {
				const command = new GetObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `${id}.json`,
				});

				response = await s3Client.send(command);
				rawBuildData = await response.Body.transformToString();
				parsedBuild = JSON.parse(rawBuildData);
			} catch (error) {
				console.log(error);
			}

			if (fetchedBuild.exists()) {
				let build = fetchedBuild.data();

				// fetch comments and update the view count
				await fetchComments(id);
				await updateViewCount(build, id);
				build.build = parsedBuild;

				dispatchBuild({ type: 'SET_BUILD', payload: { loadedBuild: build, loadingBuild: false } });
			} else {
				dispatchBuild({ type: 'SET_BUILD', payload: { loadedBuild: '', loadingBuild: false } });

				throw new Error("Couldn't find that build!");
			}
		} catch (error) {
			dispatchBuild({ type: 'SET_BUILD', payload: { loadedBuild: '', loadingBuild: false } });
			console.log(error);
			throw new Error(`Error fetching build: ${error}`);
		}
	};

	/**
	 * Hadles saving the new build to the server
	 */
	const makeBuildReadyToUpload = async build => {
		try {
			dispatchBuild({
				type: 'UPLOADING_BUILD',
				payload: true,
			});

			// Check if we have a build name
			if (build.name.length === 0) {
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

			// Check if theres types in the build
			if (build.type.length === 0) {
				toast.error('You forgot to give your build a type!');
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('You forgot to give your build a type!');
			}

			// Check name length
			if (build.name.length > 50) {
				toast.error('Build name too long');
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('Build name too long');
			}

			if (build.build.length === 0) {
				toast.error('You forgot to enter a build!');

				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('You forgot to enter a build!');
			}

			if (profanity.exists(build.name)) {
				toast.error('Build name is unacceptable!');
				dispatchBuild({
					type: 'UPLOADING_BUILD',
					payload: false,
				});
				throw new Error('Build name is unacceptable!');
			}

			return build;
		} catch (error) {
			throw new Error(`Error in makeBuildReadyToUpload: ${error}`);
		}
	};

	/**
	 * Handles updating the build in the database
	 * @param {*} ()
	 */
	const updateBuild = async build => {
		try {
			const newBuild = await makeBuildReadyToUpload(build);

			const buildJSON = JSON.stringify(newBuild.build);
			delete newBuild.build;

			// update the document
			await updateDoc(doc(db, 'builds', newBuild.id), {
				...newBuild,
			}).catch(err => {
				setSavingBuild(false);
				throw new Error(err);
			});

			// if the description changed, update AWS
			if (editingBuild.description !== build.description) {
				// update the raw build on aws
				const command = new PutObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `${newBuild.id}.json`,
					Body: buildJSON,
					ContentEncoding: 'base64',
					ContentType: 'application/json',
					ACL: 'public-read',
				});

				const response = await s3Client.send(command);

				newBuild.build = JSON.parse(buildJSON);
			}

			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					savingBuild: false,
					editingBuild: false,
					uploadingBuild: false,
					loadedBuild: newBuild,
				},
			});

			toast.success('Build updated');
		} catch (error) {
			setSavingBuild(false);
			throw new Error(error);
		}
	};

	/**
	 * handles deleting a build
	 */
	const deleteBuild = async (id, userId) => {
		try {
			// Delete the comments
			const commentsQuery = query(collection(db, 'builds', id, 'comments'));
			const commentsQuerySnapshot = await getDocs(commentsQuery);
			commentsQuerySnapshot.forEach(comment => {
				deleteDoc(doc(db, 'builds', id, 'comments', comment.id));
			});

			// Delete the build
			await deleteDoc(doc(db, 'builds', id));

			// delete it from aws
			const command = new DeleteObjectCommand({
				Bucket: process.env.REACT_APP_BUCKET,
				Key: `${id}.json`,
			});

			const response = await s3Client.send(command);

			// If the build being deleted belongs to the current user, remove it
			if (userId === user.uid) {
				const newBuildsArr = [
					...user.builds.filter(build => {
						return build !== id;
					}),
				];
				// remove it from the user
				await updateDoc(doc(db, 'users', userId), { builds: newBuildsArr });

				// remove it from the users userProfile
				await updateDoc(doc(db, 'userProfiles', userId), { builds: newBuildsArr });
			} else {
				// if its not, this is an admin deleting it and we have to fetch that users profile first, and then remove it from their builds
				const fetchedProfile = await getDoc(doc(db, 'users', userId));
				const userData = fetchedProfile.data();

				const newBuildsArr = [
					...userData.builds.filter(build => {
						return build !== id;
					}),
				];

				await updateDoc(doc(db, 'users', userId), { builds: newBuildsArr });
				await updateDoc(doc(db, 'userProfiles', userId), { builds: newBuildsArr });
			}

			const statsData = await getDoc(doc(db, 'adminPanel', 'stats'));
			const stats = statsData.data();
			await updateDoc(doc(db, 'adminPanel', 'stats'), { builds: (stats.builds -= 1) });

			navigate('/');

			// Filter the deleted build out of the loaded builds
			// dispatchBuilds({
			// 	type: 'DELETE_BUILD',
			// 	payload: id,
			// });

			toast.success(`Build Deleted!`);
		} catch (error) {
			toast.error('Something went wrong deleting this build');
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
	 * handles deleting a comment
	 * @param {*} commentId
	 */
	const deleteComment = async commentId => {
		try {
			// Delete the comments
			await deleteDoc(doc(db, 'builds', loadedBuild.id, 'comments', commentId));
			await updateDoc(doc(db, 'builds', loadedBuild.id), { commentCount: (loadedBuild.commentCount -= 1) })
				.then(() => {
					//Filter the deleted comment from the comments array
					const newComments = comments.filter(comment => comment.id !== commentId);

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
	const fetchComments = async id => {
		try {
			const commentsRef = collection(db, 'builds', id, 'comments');
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
				loadedBuild: backupBuild,
			},
		});
	};

	/**
	 * Handles cancelling a build edit. Reverts it to prev state
	 * @param {*} build
	 */
	const setEditingBuild = build => {
		dispatchBuild({
			type: 'EDITING_BUILD',
			payload: build,
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
				toast.error('Comment cant be empty');
				return;
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
				commentCount: (loadedBuild.commentCount += 1),
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

			// now fetch the comment so we can get its timestamp
			const fetchComment = await getDoc(doc(db, 'builds', loadedBuild.id, 'comments', newId.id));

			if (fetchComment.exists()) {
				const data = fetchComment.data();
				newComment.timestamp = data.timestamp;
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
	 * Handles editing a comment
	 * @param {*} comment
	 */
	const setEditingComment = comment => {
		dispatchBuild({
			type: 'EDITING_COMMENT',
			payload: comment,
		});
	};

	/**
	 * Handles upading the comment on the DB
	 */
	const updateComment = async (comment, commentId) => {
		try {
			const ref = doc(db, 'builds', loadedBuild.id, 'comments', commentId);

			await updateDoc(ref, { comment });

			toast.success('Comment Edited');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong with editing your comment. Please try again');
		}
	};

	/**
	 * handles updating the builds view count
	 */
	const updateViewCount = async (build, id) => {
		try {
			const ref = doc(db, 'builds', id);
			await updateDoc(ref, { views: (build.views += 1) });
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles updating the builds view count
	 */
	const updateDownloadCount = async (build, id) => {
		try {
			const ref = doc(db, 'builds', id);
			await updateDoc(ref, { downloads: (build.downloads += 1) });
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles uploading a build to the server. Takes in a build, and a dispatch function to add the newly created build to
	 * @param {*} build
	 */
	const uploadBuild = async build => {
		try {
			setUploadingBuild(true);
			const buildId = uuidv4().slice(0, 30);
			build.id = buildId;

			const buildJson = JSON.stringify(build.build);
			const rawBuild = buildJson;
			delete build.build;

			await setDoc(doc(db, 'builds', buildId), build).catch(err => {
				throw new Error(err);
			});

			// add it to the users 'userProfile' db
			await updateDoc(doc(db, 'userProfiles', user.uid), { builds: [...user.builds, buildId] }).catch(err => {
				throw new Error(err);
			});

			// Add it to the users 'builds'
			await updateDoc(doc(db, 'users', user.uid), { builds: [...user.builds, buildId] }).catch(err => {
				throw new Error(err);
			});

			addbuildToUser(buildId);

			const statsData = await getDoc(doc(db, 'adminPanel', 'stats'));
			const stats = statsData.data();
			await updateDoc(doc(db, 'adminPanel', 'stats'), { builds: (stats.builds += 1) });

			// now get the document so we can grab its timestamp
			const ref = doc(db, 'builds', buildId);
			const data = await getDoc(ref);

			if (data.exists()) {
				const loadedBuild = data.data();
				const newId = data.id;
				build.timestamp = loadedBuild.timestamp;

				// add the build to the list of fetched builds
				dispatchBuilds({
					type: 'ADD_BUILD',
					payload: build,
				});

				// add the builds to aws
				const command = new PutObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `${buildId}.json`,
					Body: rawBuild,
					ContentEncoding: 'base64',
					ContentType: 'application/json',
					ACL: 'public-read',
				});

				const response = await s3Client.send(command);

				// Add it to the users 'Upvoted'
				await handleVoting('upVote', build);

				toast.success('Build created!');
				return newId;
			}
		} catch (error) {
			console.log(error);
			setUploadingBuild(false);
		}
	};

	/**
	 * Handles setting the uploading build state
	 * @param {*} bool
	 */
	const setUploadingBuild = bool => {
		dispatchBuild({
			type: 'UPLOADING_BUILD',
			payload: bool,
		});
	};

	return {
		uploadBuild,
		setUploadingBuild,
		setBaseBuild,
		setEditingBuild,
		setEditingComment,
		cancelBuilEdit,
		setSavingBuild,
		fetchComments,
		deleteComment,
		setDeletingComment,
		deleteBuild,
		updateBuild,
		makeBuildReadyToUpload,
		fetchBuild,
		addComment,
		setComment,
		updateComment,
		updateViewCount,
		updateDownloadCount,
	};
};

export default useBuild;
