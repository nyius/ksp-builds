import { useContext, useState } from 'react';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, setDoc, getDocs, serverTimestamp, getDocsFromCache, getDocFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';
import { toast } from 'react-toastify';
import { compressAccurately } from 'image-conversion';
import { auth } from '../../firebase.config';
import { profanity } from '@2toad/profanity';
import { cloneDeep } from 'lodash';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
//---------------------------------------------------------------------------------------------------//
import { uploadImage } from '../../utilities/uploadImage';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import standardNotifications from '../../utilities/standardNotifications';
//---------------------------------------------------------------------------------------------------//
import BuildContext from './BuildContext';
import BuildsContext from '../builds/BuildsContext';
import AuthContext from '../auth/AuthContext';
import useAuth from '../auth/AuthActions';
import FiltersContext from '../filters/FiltersContext';
import useBuilds from '../builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//

const useBuild = () => {
	const navigate = useNavigate();
	const { dispatchBuild, replyingComment, comments, loadedBuild, comment, settingBuildOfTheWeek } = useContext(BuildContext);
	const { dispatchBuilds } = useContext(BuildsContext);
	const { kspVersions } = useContext(FiltersContext);
	const { user } = useContext(AuthContext);
	const { fetchLastUpdatedBuilds } = useBuilds();
	const { addbuildToUser, handleVoting, sendNotification } = useAuth();

	/**
	 * Fetches the build from the server and dispatches the result.
	 * @param {*} id
	 */
	const fetchBuild = async id => {
		dispatchBuild({ type: 'LOADING_BUILD', payload: true });

		try {
			const buildRef = doc(db, process.env.REACT_APP_BUILDSDB, id);
			let response, rawBuildData, parsedBuild;

			// get the build from the db
			const fetchedBuild = await getDoc(buildRef);

			// Get the raw build from aws
			if (process.env.REACT_APP_ENV !== 'DEV') {
				try {
					const command = new GetObjectCommand({
						Bucket: process.env.REACT_APP_BUCKET,
						Key: `${id}.json`,
					});

					response = await s3Client.send(command);
					rawBuildData = await response.Body.transformToString();

					// If we have an older uncompressed buildFile
					if (rawBuildData.includes('AssemblyOABConfig')) {
						parsedBuild = JSON.parse(rawBuildData);
					} else {
						const decompress = decompressFromEncodedURIComponent(rawBuildData);
						parsedBuild = JSON.parse(decompress);
					}
				} catch (error) {
					console.log(error);
				}
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
			const rawBuild = JSON.stringify(build.build);

			if (build.name.length === 0) {
				toast.error('Please enter a build name');
				return;
			}

			if (build.name.length > 50) {
				toast.error('Build name too long');
				return;
			}

			if (profanity.exists(build.name)) {
				toast.error('Build name is unacceptable!');
				return;
			}

			if (!user) {
				toast.error('Please log in or create an account to save a build');
				return;
			}

			if (build.type.length === 0) {
				toast.error('You forgot to give your build a type!');
				return;
			}

			if (build.images.length > 6) {
				toast.error('Too many build images! Max 6');
				return;
			}

			if (process.env.REACT_APP_ENV !== 'DEV') {
				if (build.build.trim() === '') {
					toast.error('You forgot to include the build!');
					return;
				}
				if (!rawBuild.includes(`OwnerPlayerGuidString`) && !rawBuild.includes(`AssemblyOABConfig`)) {
					toast.error('Uh oh, It seems like you have entered an invalid craft! Check out the "How?" Button to see how to properly copy & paste your craft.');
					return;
				}
				try {
					const json = JSON.parse(rawBuild);
				} catch (error) {
					toast.error('Uh oh, It seems like you have entered an invalid craft! Check out the "How?" Button to see how to properly copy & paste your craft.');
					return;
				}
			}

			if (build.kspVersion === 'any') {
				build.kspVersion = kspVersions[0];
			}

			let newTags = [];
			let tagProfanity = false;
			build.tags.map(tag => {
				if (profanity.exists(tag)) {
					tagProfanity = true;
				}
				newTags.push(tag.trim());
			});

			if (tagProfanity) {
				toast.error('Tags contain unacceptable words!');
				return;
			}

			build.searchName = build.name.toLowerCase();

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
			const buildStatus = await makeBuildReadyToUpload(build);
			if (!buildStatus) return;

			setUploadingBuild(true);

			const buildJSON = JSON.stringify(build.build);
			delete build.build;

			if (build.thumbnail !== build.images[0]) {
				build.thumbnail = build.images[0];
			}

			build.lastModified = serverTimestamp();

			// update the document
			await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), {
				...build,
			}).catch(err => {
				setSavingBuild(false);
				throw new Error(err);
			});

			// if the build changed, update AWS
			if (process.env.REACT_APP_ENV !== 'DEV') {
				const compressedBuild = compressToEncodedURIComponent(buildJSON);

				// update the raw build on aws
				const command = new PutObjectCommand({
					Bucket: process.env.REACT_APP_BUCKET,
					Key: `${build.id}.json`,
					Body: compressedBuild,
					ContentEncoding: 'base64',
					ContentType: 'application/json',
					ACL: 'public-read',
				});

				const response = await s3Client.send(command);

				build.build = JSON.parse(buildJSON);
			}

			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					savingBuild: false,
					editingBuild: false,
					uploadingBuild: false,
					loadedBuild: build,
					resetTextEditor: true,
				},
			});

			toast.success('Build updated');
			setUploadingBuild(false);
		} catch (error) {
			setUploadingBuild(false);
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
			const commentsQuery = query(collection(db, process.env.REACT_APP_BUILDSDB, id, 'comments'));
			const commentsQuerySnapshot = await getDocs(commentsQuery);
			commentsQuerySnapshot.forEach(comment => {
				deleteDoc(doc(db, process.env.REACT_APP_BUILDSDB, id, 'comments', comment.id));
			});

			// Delete the build
			await deleteDoc(doc(db, process.env.REACT_APP_BUILDSDB, id));

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
			await deleteDoc(doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id, 'comments', commentId));
			await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id), { commentCount: (loadedBuild.commentCount -= 1) })
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
			const commentsRef = collection(db, process.env.REACT_APP_BUILDSDB, id, 'comments');
			const commentsSnapshot = await getDocs(commentsRef);

			const commentsList = commentsSnapshot.docs.map(doc => {
				const comment = doc.data();
				comment.id = doc.id;
				return comment;
			});

			if (commentsList) commentsList.sort((a, b) => a.timestamp - b.timestamp);

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

			const postRef = collection(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id, 'comments');

			// Create the comment for the DB
			const newComment = {
				comment: comment,
				profilePicture: user.profilePicture,
				timestamp: new Date(),
				username: user.username,
				uid: user.uid,
			};

			if (replyingComment) {
				const plainText = draftJsToPlainText(replyingComment.comment);

				newComment.replyCommentUsername = replyingComment.username;
				newComment.replyCommentId = replyingComment.id;
				newComment.replyTimestamp = replyingComment.timestamp;
				newComment.replyComment = plainText.slice(0, 40);
			}

			// Add it to the DB
			const newId = await addDoc(postRef, newComment);

			newComment.id = newId.id;

			// Update the comment count on the build list
			const update = doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id);
			await updateDoc(update, {
				commentCount: (loadedBuild.commentCount += 1),
			});

			// Handle nofitications
			const newNotif = { ...standardNotifications };
			newNotif.buildId = loadedBuild.id;
			newNotif.buildName = loadedBuild.name;
			newNotif.uid = user.uid;
			newNotif.username = user.username;
			newNotif.timestamp = new Date();
			newNotif.profilePicture = user.profilePicture;
			newNotif.comment = comment;
			newNotif.commentId = newId.id;

			// If we're replying to someones comment, give that user a notification
			if (replyingComment && replyingComment.username !== user.username) {
				newNotif.type = 'reply';
				await sendNotification(replyingComment.uid, newNotif);
			}
			// Send a notification to the build author
			if (loadedBuild.uid !== user.uid && replyingComment?.uid !== loadedBuild.uid) {
				newNotif.type = 'comment';
				await sendNotification(loadedBuild.uid, newNotif);
			}

			// now fetch the comment so we can get its timestamp
			const fetchComment = await getDoc(doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id, 'comments', newId.id));

			if (fetchComment.exists()) {
				const data = fetchComment.data();
				newComment.timestamp = data.timestamp;
			}

			toast.success('Commented!');

			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					comment: '',
					comments: [...comments, newComment],
					replyingComment: null,
					resetTextEditor: true,
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
	 * Handles editing a comment
	 * @param {*} comment
	 */
	const setReplyingComment = comment => {
		dispatchBuild({
			type: 'REPLYING_COMMENT',
			payload: comment,
		});
	};

	/**
	 * Handles upading the comment on the DB
	 */
	const updateComment = async (comment, commentId) => {
		try {
			const ref = doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id, 'comments', commentId);

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
			const ref = doc(db, process.env.REACT_APP_BUILDSDB, id);
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
			const ref = doc(db, process.env.REACT_APP_BUILDSDB, id);
			await updateDoc(ref, { downloads: (build.downloads += 1) });
		} catch (error) {
			console.log(error);
		}
	};

	const [loading, setLoading] = useState(null);
	/**
	 * Handles uploading a build to the server. Takes in a build, and a dispatch function to add the newly created build to
	 * @param {*} build
	 */
	const uploadBuild = async build => {
		try {
			const buildStatus = await makeBuildReadyToUpload(build);
			if (!buildStatus) return;

			setUploadingBuild(true);

			const buildId = uuidv4().slice(0, 30);
			build.id = buildId;

			// Stringify the json build and remove it from the main build object so it doesnt get uploaded to firebase (as its huge)
			// It will be uploaded to ASW S3 instead
			const buildJson = JSON.stringify(build.build);
			const rawBuild = buildJson;
			delete build.build;

			const compressedBuild = compressToEncodedURIComponent(rawBuild);

			// Create the thumbnail
			if (typeof build.thumbnail !== 'string') {
				const convertThumb = await compressAccurately(build.thumbnail, 150);
				const thumbURL = await uploadImage(convertThumb, setLoading, auth.currentUser.uid);
				build.thumbnail = thumbURL;
			}

			// Add the build object to the DB
			await setDoc(doc(db, process.env.REACT_APP_BUILDSDB, buildId), build).catch(err => {
				throw new Error('Error from build setDoc', err);
			});

			// add it to the users 'userProfile' db
			await updateDoc(doc(db, 'userProfiles', user.uid), { builds: [...user.builds, buildId] }).catch(err => {
				throw new Error('Error from profile updateDoc', err);
			});

			// Add it to the users process.env.REACT_APP_BUILDSDB
			await updateDoc(doc(db, 'users', user.uid), { builds: [...user.builds, buildId] }).catch(err => {
				throw new Error('Error from user updateDoc', err);
			});

			addbuildToUser(buildId);

			// now get the document so we can grab its timestamp
			const ref = doc(db, process.env.REACT_APP_BUILDSDB, buildId);
			const data = await getDoc(ref);

			// If our build was created correctly
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
				if (process.env.REACT_APP_ENV !== 'DEV') {
					const command = new PutObjectCommand({
						Bucket: process.env.REACT_APP_BUCKET,
						Key: `${buildId}.json`,
						Body: compressedBuild,
						ContentEncoding: 'base64',
						ContentType: 'application/json',
						ACL: 'public-read',
					});

					const response = await s3Client.send(command).catch(err => {
						throw new Error('Error from rawBuild to S3', err);
					});
				}

				// Add it to the users 'Upvoted'
				await handleVoting('upVote', build).catch(err => {
					throw new Error('Error from handle voting', err);
				});

				// Give all of the following users a notification
				// Handle nofitications
				if (build.visibility === 'public' && process.env.REACT_APP_ENV !== 'DEV') {
					const newNotif = { ...standardNotifications };
					newNotif.buildId = newId;
					newNotif.buildName = loadedBuild.name;
					newNotif.uid = loadedBuild.uid;
					newNotif.username = loadedBuild.author;
					newNotif.timestamp = new Date();
					newNotif.thumbnail = loadedBuild.thumbnail;
					newNotif.type = 'newBuild';

					const userProfileData = await getDoc(doc(db, 'userProfiles', user.uid));
					const userProfile = userProfileData.data();
					const followers = userProfile.followers;

					if (followers) {
						followers.map(follower => {
							const sendNotif = async () => {
								try {
									await sendNotification(follower, newNotif);
								} catch (error) {
									console.log(error);
								}
							};

							sendNotif();
						});
					}
				}

				toast.success('Build created!');

				setUploadingBuild(false);

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

	/**
	 * Handles setting the "reset" for the text editor state. True resets it.
	 * @param {*} bool
	 */
	const setResetTextEditorState = bool => {
		dispatchBuild({
			type: 'ESET_TEXT_EDITOR',
			payload: bool,
		});
	};

	/**
	 * handles getting ready to set the build of the week. Saves it to the context
	 * @param {*} build
	 */
	const setBuildOfTheWeek = build => {
		dispatchBuild({
			type: 'SET_BUILD_OF_THE_WEEK',
			payload: build,
		});
	};

	/**
	 * Handles making a build the build of the week
	 * @param {*} build
	 */
	const makeBuildOfTheWeek = async notification => {
		try {
			if (notification === '') {
				throw new Error('Forgot to change notification');
			}
			await updateDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuilds'), { [settingBuildOfTheWeek.id]: { dateAdded: serverTimestamp() } });
			await updateDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuild'), { id: settingBuildOfTheWeek.id, dateAdded: serverTimestamp() });

			if (process.env.REACT_APP_ENV !== 'DEV') {
				await updateDoc(doc(db, 'builds', settingBuildOfTheWeek.id), { buildOfTheWeek: serverTimestamp() });
			} else {
				await updateDoc(doc(db, 'testBuilds', settingBuildOfTheWeek.id), { buildOfTheWeek: serverTimestamp() });
			}

			// Notify the author
			const newNotif = cloneDeep(standardNotifications);
			newNotif.uid = user.uid;
			newNotif.username = user.username;
			newNotif.timestamp = new Date();
			newNotif.profilePicture = user.profilePicture;
			newNotif.message = notification;
			newNotif.type = 'buildOfTheWeek';
			newNotif.buildId = settingBuildOfTheWeek.id;
			newNotif.buildName = settingBuildOfTheWeek.name;
			delete newNotif.comment;
			delete newNotif.commentId;

			await sendNotification(settingBuildOfTheWeek.uid, newNotif);

			// Update the author to have 'build of the week' badge
			await updateDoc(doc(db, 'users', settingBuildOfTheWeek.uid), { buildOfTheWeekWinner: true });
			await updateDoc(doc(db, 'userProfiles', settingBuildOfTheWeek.uid), { buildOfTheWeekWinner: true });

			toast.success('Made build of the week!');
		} catch (error) {
			console.log(error);
			toast.error(`Whoops... Something went wrong: ${error} `);
		}
	};

	return {
		setUploadingBuild,
		setBaseBuild,
		setEditingBuild,
		setEditingComment,
		setReplyingComment,
		setComment,
		setSavingBuild,
		setDeletingComment,
		setBuildOfTheWeek,
		setResetTextEditorState,
		cancelBuilEdit,
		fetchComments,
		deleteComment,
		uploadBuild,
		deleteBuild,
		updateBuild,
		makeBuildReadyToUpload,
		fetchBuild,
		addComment,
		updateComment,
		updateViewCount,
		updateDownloadCount,
		makeBuildOfTheWeek,
	};
};

export default useBuild;
