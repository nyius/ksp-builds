import { useEffect, useState } from 'react';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, setDoc, where, getDocs, serverTimestamp, getDocsFromCache, getDocFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate, useParams } from 'react-router-dom';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../S3.config';
import { toast } from 'react-toastify';
import { compressAccurately } from 'image-conversion';
import { auth } from '../../firebase.config';
import { cloneDeep } from 'lodash';
import { compressToEncodedURIComponent } from 'lz-string';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
//---------------------------------------------------------------------------------------------------//
import { uploadImage } from '../../utilities/uploadImage';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import standardNotifications from '../../utilities/standardNotifications';
import { buildNameToUrl } from '../../utilities/buildNameToUrl';
import getBuildPartCount from '../../utilities/getBuildPartCount';
import fetchBuildFromAWS from '../../utilities/fetchBuildFromAws';
//---------------------------------------------------------------------------------------------------//
import { useBuildContext } from './BuildContext';
import { useBuildsContext } from '../builds/BuildsContext';
import { useAuthContext } from '../auth/AuthContext';
import { useUpdateProfile, useHandleVoting, useFetchUser } from '../auth/AuthActions';
import { sendNotification } from '../auth/AuthUtils';
import { useFiltersContext } from '../filters/FiltersContext';
import { updateDownloadCount, updateViewCount, makeBuildReadyToUpload, searchBuilds, setLocalStoredBuild, getBuildFromLocalStorage, checkLocalBuildAge, deleteBuildFromLocalStorage } from './BuildUtils';
import { useAddBuildToHangar } from '../hangars/HangarActions';
import { useNewsContext } from '../news/NewsContext';
import errorReport from '../../utilities/errorReport';
//---------------------------------------------------------------------------------------------------//

/**
 * Fetches the build and dispatches the result. First checks local storage. If no build is found or is out of date, fetches from server.
 * @param {string} id - id of the build to fetch
 */
const useFetchBuild = async id => {
	const { dispatchBuild } = useBuildContext();
	const { fetchComments } = useFetchComments();

	useEffect(() => {
		const fetchBuild = async () => {
			dispatchBuild({ type: 'LOADING_BUILD', payload: true });

			try {
				const newId = buildNameToUrl(id);

				let localBuildById = getBuildFromLocalStorage(newId);

				if (localBuildById) {
					if (checkLocalBuildAge(localBuildById.lastFetchedTimestamp, process.env.REACT_APP_CACHE_TIMEOUT)) {
						await fetchBuildFromServer(localBuildById.id);
					} else {
						setLoadedBuild(dispatchBuild, localBuildById);
						await fetchComments(localBuildById.id);
						await updateViewCount(localBuildById);
						return;
					}
				} else {
					await fetchBuildFromServer(id);
				}
			} catch (error) {
				setLoadedBuild(dispatchBuild, '');
				errorReport(`Error fetching build: ${error.message}`, true, 'fetchBuild');
			}
		};
		fetchBuild();
	}, [id]);

	/**
	 * handles fetching a build from the server
	 * @param {string} id - the id of the build to fetch from the server
	 */
	const fetchBuildFromServer = async id => {
		try {
			const buildRef = doc(db, process.env.REACT_APP_BUILDSDB, id);

			// get the build from the db
			const fetchedBuild = await getDoc(buildRef);

			if (fetchedBuild.exists()) {
				let build = fetchedBuild.data();
				setLocalStoredBuild(build);
				setLoadedBuild(dispatchBuild, build);

				// fetch comments and update the view count
				await fetchComments(id);
				await updateViewCount(build);
			} else {
				// maybe the URL isn't the id, but instead the builds name. Search for that next
				const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
				let q = query(buildsRef, where('urlName', '==', id));
				const fetchedBuilds = await getDocs(q);

				let build;
				fetchedBuilds.forEach(doc => {
					build = doc.data();
				});

				if (build) {
					setLoadedBuild(dispatchBuild, build);

					// fetch comments and update the view count
					await fetchComments(build.id);
					await updateViewCount(build);
				} else {
					setLoadedBuild(dispatchBuild, '');
					throw new Error("Couldn't find that build!");
				}
			}
		} catch (error) {
			setLoadedBuild(dispatchBuild, '');
			if (error.message.includes('client is offline') || error.message.includes(`Couldn't find`)) {
				errorReport(`Error fetching build: ${error.message}`, false, 'fetchBuildFromServer');
			} else {
				errorReport(`Error fetching build: ${error.message}`, true, 'fetchBuildFromServer');
			}
		}
	};
};

export default useFetchBuild;

/**
 * Hook with funcionality for fetching a builds comments
 * @returns { fetchComments }
 */
export const useFetchComments = () => {
	const { dispatchBuild } = useBuildContext();

	/**
	 * Fetches a builds comments
	 * @param {string} buildId - the builds Id
	 */
	const fetchComments = async buildId => {
		try {
			const commentsRef = collection(db, process.env.REACT_APP_BUILDSDB, buildId, 'comments');
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
			dispatchBuild({
				type: 'SET_BUILD',
				payload: { commentsLoading: false },
			});
			errorReport(`Error fetching comments: ${error.message}`, true, 'fetchComments');
		}
	};

	return { fetchComments };
};

/**
 * Hook for making a build of the week
 * @returns
 */
export const useMakeBuildOfTheWeek = () => {
	const { buildOfTheWeek } = useBuildContext();
	const { user } = useAuthContext();

	/**
	 * handles making a build the build of the week
	 * @param {*} notification - the notification to send to the user who wins
	 */
	const makeBuildOfTheWeek = async notification => {
		try {
			if (notification === '') {
				throw new Error('Forgot to change notification');
			}
			await updateDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuilds'), { [buildOfTheWeek.id]: { dateAdded: serverTimestamp() } });
			await updateDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuild'), { id: buildOfTheWeek.id, dateAdded: serverTimestamp() });

			if (process.env.REACT_APP_ENV !== 'DEV') {
				await updateDoc(doc(db, 'builds', buildOfTheWeek.id), { buildOfTheWeek: serverTimestamp() });
			} else {
				await updateDoc(doc(db, 'testBuilds', buildOfTheWeek.id), { buildOfTheWeek: serverTimestamp() });
			}

			// Notify the author
			const newNotif = cloneDeep(standardNotifications);
			newNotif.uid = user.uid;
			newNotif.username = user.username;
			newNotif.timestamp = new Date();
			newNotif.profilePicture = user.profilePicture;
			newNotif.message = notification;
			newNotif.type = 'buildOfTheWeek';
			newNotif.buildId = buildOfTheWeek.id;
			newNotif.buildName = buildOfTheWeek.name;
			delete newNotif.comment;
			delete newNotif.commentId;

			await sendNotification(buildOfTheWeek.uid, newNotif);

			// Update the author to have 'build of the week' badge
			await updateDoc(doc(db, 'users', buildOfTheWeek.uid), { buildOfTheWeekWinner: true });
			await updateDoc(doc(db, 'userProfiles', buildOfTheWeek.uid), { buildOfTheWeekWinner: true });

			toast.success('Made build of the week!');
		} catch (error) {
			errorReport(`Whoops... Something went wrong: ${error.message}`, false, 'makeBuildOfTheWeek');
			toast.error(`Whoops... Something went wrong: ${error}`);
		}
	};

	return { makeBuildOfTheWeek };
};

/**
 * Hook with functions for handling interaction with comments
 * @returns
 */
export const useComment = () => {
	const { dispatchBuild, comments, comment, loadedBuild, replyingComment } = useBuildContext();
	const { user } = useAuthContext();

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
	 * Handles setting a comment in the context while writing
	 * @param {string} comment
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
	 * handles deleting a comment
	 * @param {string} commentId - id of the comment to delete
	 */
	const deleteComment = async commentId => {
		try {
			// Delete the comments
			await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id, 'comments', commentId), {
				comment: `deleted`,
				deleted: true,
			});
			await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, loadedBuild.id), { commentCount: (loadedBuild.commentCount -= 1) });

			const newComments = comments.map(comment => {
				if (comment.id === commentId) {
					comment.comment = `deleted`;
					comment.deleted = true;
				}
				return comment;
			});

			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					deletingCommentId: null,
					comments: newComments,
				},
			});

			toast.success('Comment deleted');
		} catch (error) {
			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					deletingCommentId: null,
				},
			});
			toast.error(`Something went wrong deleting the comment`);
			throw new Error(error);
		}
	};

	return { addComment, setComment, deleteComment };
};

/**
 * Hook for copying a build to a clipboard
 * @returns
 */
export const useCopyBuildToClipboard = () => {
	const { dispatchBuild, fetchedRawBuilds } = useBuildContext();

	/**
	 * handles copying a build to the clipboard. Fetches it from AWS and stores it in context
	 * @param {function} setLoadingState - a state setter function
	 * @param {string} buildId - Id of the build to copy
	 */
	const copyBuildToClipboard = async (setLoadingState, buildId) => {
		try {
			if (fetchedRawBuilds[buildId]) {
				navigator.clipboard.writeText(fetchedRawBuilds[buildId]);
				toast.success('Build coped to clipboard!');

				await updateDownloadCount(buildId);
			} else {
				setLoadingState(true);
				const build = await fetchBuildFromAWS(buildId);

				if (build) {
					navigator.clipboard.writeText(build);
					toast.success('Build coped to clipboard!');

					await updateDownloadCount(buildId);
					dispatchBuild({
						type: 'SET_LOADED_RAW_BUILD',
						payload: { id: buildId, rawBuild: build },
					});
				}
			}

			setLoadingState(false);
		} catch (error) {
			throw new Error(error);
		}
	};
	return { copyBuildToClipboard };
};

/**
 * Hook for updating a build
 * @returns
 */
export const useUpdateBuild = () => {
	const { dispatchBuild, loadedBuild } = useBuildContext();

	/**
	 * Handles updating the build in the database
	 * @param {obj} build - takes in a build to update on the database
	 */
	const updateBuild = async build => {
		try {
			const buildStatus = await makeBuildReadyToUpload(build);
			if (!buildStatus) return;

			setUploadingBuild(dispatchBuild, true);

			const buildJSON = JSON.stringify(build.build);
			build.partCount = getBuildPartCount(buildJSON);
			delete build.build;
			delete build.rawImageFiles;
			delete build.timestamp;
			delete build.lastFetchedTimestamp;
			delete build.views;
			delete build.upVotes;
			delete build.downVotes;

			if (build.thumbnail !== build.images[0]) {
				build.thumbnail = build.images[0];
			}

			// Check if the user changed the name
			if (loadedBuild.name !== build.name) {
				const availableNameNum = await searchBuilds(0, build.name);

				if (availableNameNum === 0) {
					build.urlName = buildNameToUrl(build.name);
				} else {
					build.urlName = `${buildNameToUrl(build.name)}-${availableNameNum}`;
				}
				build.searchName = build.name.toLowerCase();
			}

			build.lastModified = serverTimestamp();

			const buildRef = doc(db, process.env.REACT_APP_BUILDSDB, build.id);

			// update the document
			await updateDoc(buildRef, {
				...build,
			}).catch(err => {
				setSavingBuild(dispatchBuild, false);
				throw new Error(err);
			});

			// if the build changed, update AWS
			if (process.env.REACT_APP_ENV !== 'DEV' && buildJSON) {
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

			// get the build from the db so we get new timestamps
			const fetchedBuild = await getDoc(buildRef);
			setLocalStoredBuild(fetchedBuild.data());

			dispatchBuild({
				type: 'SET_BUILD',
				payload: {
					savingBuild: false,
					editingBuild: false,
					uploadingBuild: false,
					loadedBuild: fetchedBuild.data(),
					resetTextEditor: true,
				},
			});

			toast.success('Build updated');
			setUploadingBuild(dispatchBuild, false);
		} catch (error) {
			setUploadingBuild(dispatchBuild, false);
			setSavingBuild(dispatchBuild, false);
			throw new Error(error);
		}
	};

	return { updateBuild };
};

/**
 * Hook for deleting a build
 * @returns
 */
export const useDeleteBuild = () => {
	const { user } = useAuthContext();
	const navigate = useNavigate();

	/**
	 * handles deleting a build
	 * @param {string} id - id of the build to delete
	 * @param {string} userId - id of the person deleting the build
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

			await s3Client.send(command);

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

			deleteBuildFromLocalStorage(id);

			navigate('/');

			toast.success(`Build Deleted!`);
		} catch (error) {
			toast.error('Something went wrong deleting this build');
			throw new Error(error);
		}
	};

	return { deleteBuild };
};

/**
 * Hook for uploading a build
 * @returns
 */
export const useUploadBuild = () => {
	const { addBuildToHangar } = useAddBuildToHangar();
	const { dispatchBuild } = useBuildContext();
	const { user } = useAuthContext();
	const { updateUserProfilesAndDb } = useUpdateProfile();
	const { dispatchBuilds } = useBuildsContext();
	const { kspVersions } = useFiltersContext();
	const { handleVoting } = useHandleVoting();

	const [loading, setLoading] = useState(null);

	/**
	 * Handles uploading a build to the server. Takes in a build, and a dispatch function to add the newly created build to
	 * @param {obj} build - the build to upload
	 */
	const uploadBuild = async build => {
		try {
			const buildStatus = await makeBuildReadyToUpload(build);
			if (!buildStatus) return;

			setUploadingBuild(dispatchBuild, true);

			const buildId = build.id;
			if (build.kspVersion === 'any') build.kspVersion = kspVersions[0];

			const availableNameNum = await searchBuilds(0, build.name);
			if (availableNameNum === 0) {
				build.urlName = buildNameToUrl(build.name);
			} else {
				build.urlName = `${buildNameToUrl(build.name)}-${availableNameNum}`;
			}

			// Stringify the json build and remove it from the main build object so it doesnt get uploaded to firebase (as its huge)
			// It will be uploaded to ASW S3 instead
			const buildJson = JSON.stringify(build.build);
			build.partCount = getBuildPartCount(buildJson);
			delete build.build;
			delete build.rawImageFiles;

			const compressedBuild = compressToEncodedURIComponent(buildJson);

			// Create the thumbnail
			if (typeof build.thumbnail !== 'string') {
				const convertThumb = await compressAccurately(build.thumbnail, { size: 150, width: 600 });
				const thumbURL = await uploadImage(convertThumb, setLoading, auth.currentUser.uid);
				build.thumbnail = thumbURL;
			}

			// Check if the user entered a description.
			if (typeof build.description !== 'string') {
				build.description = `{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;
			}

			// Add the build object to the DB
			await setDoc(doc(db, process.env.REACT_APP_BUILDSDB, buildId), build).catch(err => {
				throw new Error('Error from build setDoc', err);
			});

			// add it to the users 'userProfile' db
			await updateUserProfilesAndDb({ builds: [...user.builds, buildId] });

			// Get the document so we can grab its timestamp
			const ref = doc(db, process.env.REACT_APP_BUILDSDB, buildId);
			const data = await getDoc(ref);

			// If our build was created correctly
			if (data.exists()) {
				const loadedBuild = data.data();
				const newId = data.id;
				build.timestamp = loadedBuild.timestamp;
				build.lastModified = loadedBuild.lastModified;

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
							sendNotification(follower, newNotif);
						});
					}
				}

				// Add the build to the users hangars (if they selected to)
				await addBuildToHangar(newId);

				toast.success('Build created!');

				setUploadingBuild(dispatchBuild, false);
				resetUploadBuild(dispatchBuild);

				return newId;
			}
		} catch (error) {
			errorReport(error.message, false, 'uploadBuild');
			setUploadingBuild(dispatchBuild, false);
		}
	};

	return { uploadBuild };
};

/**
 * Handles navigatng home if the user visits a private build thats not their own
 */
export const useNavigateIfPrivateBuild = () => {
	const { loadingBuild, loadedBuild } = useBuildContext();
	const { user } = useAuthContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loadingBuild && loadedBuild) {
			if (loadedBuild.visibility === 'private' && user.uid !== loadedBuild.uid) {
				navigate('/');
			}
		}
	}, [loadingBuild, loadedBuild, user]);
};

/**
 * Waits for a build to load and then returns  draftJS compatible build description
 * @param {*} initialState
 * @returns
 */
export const useGetBuildDesc = initialState => {
	const [buildDesc, setBuildDesc] = useState(initialState);
	const { loadingBuild, loadedBuild } = useBuildContext();

	useEffect(() => {
		if (!loadingBuild && loadedBuild) {
			setBuildDesc(EditorState.createWithContent(convertFromRaw(JSON.parse(loadedBuild.description))));
		}
	}, [loadingBuild, loadedBuild]);

	return [buildDesc, setBuildDesc];
};

/**
 * Fetches the current loaded builds authors profile.
 */
export const useFetchBuildAuthorProfile = () => {
	const { loadingBuild, loadedBuild } = useBuildContext();
	const { fetchUsersProfile } = useFetchUser();

	useEffect(() => {
		if (!loadingBuild && loadedBuild) {
			fetchUsersProfile(loadedBuild.uid);
		}
	}, [loadingBuild, loadedBuild]);
};

/**
 * Handles setting the build to upload to the server.
 * @param {obj} buildToUpload - the build to upload
 */
export const useSetBuildToUpload = buildToUpload => {
	const { dispatchBuild } = useBuildContext();

	useEffect(() => {
		setBuildToUpload(dispatchBuild, buildToUpload);
	}, []);
};

/**
 * Handles checking if the current URL contains a challenge. Used for Upload/Edit build page
 * @returns [challengeParam, setChallengeParam, gettingChallenge]
 */
export const useGetBuildChallenge = initialState => {
	const { dispatchBuild, buildToUpload } = useBuildContext();
	const { challenges, articlesLoading } = useNewsContext();
	const challengeParams = useParams().id;
	const [challengeParam, setChallengeParam] = useState(initialState);

	useEffect(() => {
		// Check if the user came here from clicking a 'submit build for ___ challenge' button.
		if (challengeParams && buildToUpload) {
			if (!articlesLoading && challengeParams.includes('challenge=')) {
				const challengeId = challengeParams.replace('challenge=', '');
				const challenge = challenges.filter(challenge => {
					if (challenge.articleId === challengeId) return challenge;
				});
				if (challenge.length > 0) {
					setBuildToUpload(dispatchBuild, { ...buildToUpload, forChallenge: challengeId, challengeTitle: challenge[0].title });
					setChallengeParam(challengeId);
				} else {
					console.log(`Couldnt find that challenge`);
				}
			}
		}
	}, [articlesLoading, challengeParams]);

	return [challengeParam, setChallengeParam];
};

/**
 * handles setting the raw image files if the user is editing a build
 */
export const useGetEditingBuildRawImages = () => {
	const { dispatchBuild, buildToUpload, editingBuild } = useBuildContext();

	useEffect(() => {
		if (buildToUpload && !buildToUpload.rawImageFiles) {
			setBuildToUpload(dispatchBuild, { ...buildToUpload, rawImageFiles: editingBuild.images });
		}
	}, [buildToUpload]);
};

/**
 * Handles fetching the raw build of the currently editing build. Sets the fetched raw build into the 'buildToUpload' object in context
 * @returns [loadingRawBuild, setLoadingRawBuild]
 */
export const useGetEditingBuildRawBuild = () => {
	const { dispatchBuild, buildToUpload, editingBuild } = useBuildContext();
	const [loadingRawBuild, setLoadingRawBuild] = useState(true);

	useEffect(() => {
		if (editingBuild) {
			setLoadingRawBuild(true);

			const fetchRawBuild = async () => {
				try {
					const fetchedRawBuild = await fetchBuildFromAWS(editingBuild.id);
					return fetchedRawBuild;
				} catch (error) {
					toast.error('Something went wrong fetching the Raw build');
				}
			};

			fetchRawBuild().then(fetchedRawBuild => {
				setBuildToUpload(dispatchBuild, { ...buildToUpload, build: fetchedRawBuild });
				setLoadingRawBuild(false);
			});
		}
	}, [editingBuild]);

	return [loadingRawBuild, setLoadingRawBuild];
};

/**
 * Handles setting the build types in the current build to upload.
 * @param {arr} types - array of selected types
 */
export const useSetUploadBuildTypes = types => {
	const { dispatchBuild, buildToUpload } = useBuildContext();

	useEffect(() => {
		setBuildToUpload(dispatchBuild, { ...buildToUpload, types });
	}, [types]);
};

/**
 * Handles setting the build description in the current build to upload.
 * @param {arr} description - the builds description
 */
export const useSetUploadBuildDesc = description => {
	const { dispatchBuild, buildToUpload } = useBuildContext();

	useEffect(() => {
		setBuildToUpload(dispatchBuild, { ...buildToUpload, description });
	}, [description]);
};

// State Updaters ---------------------------------------------------------------------------------------------------//
/**
 * handles getting ready to set the build of the week. Saves it to the context
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} build - the build to make build of the week
 */
export const setBuildOfTheWeek = (dispatchBuild, build) => {
	dispatchBuild({
		type: 'SET_BUILD_OF_THE_WEEK',
		payload: build,
	});
};

/**
 * Handles setting the "reset" for the text editor state in context. True resets it.
 * @param {function} dispatchBuild - The dispatch function
 * @param {bool} bool - true to reset state
 */
export const setResetTextEditorState = (dispatchBuild, bool) => {
	dispatchBuild({
		type: 'RESET_TEXT_EDITOR',
		payload: bool,
	});
};

/**
 * Handles setting the uploading build state in context
 * @param {function} dispatchBuild - The dispatch function
 * @param {bool} bool - true or false
 */
export const setUploadingBuild = (dispatchBuild, bool) => {
	dispatchBuild({
		type: 'UPLOADING_BUILD',
		payload: bool,
	});
};

/**
 * Handles setting the replying comment in context
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} comment - the comment thats being replied to
 */
export const setReplyingComment = (dispatchBuild, comment) => {
	dispatchBuild({
		type: 'REPLYING_COMMENT',
		payload: comment,
	});
};

/**
 * Handles setting the comment being edited in context
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} comment - comment to be edited
 */
export const setEditingComment = (dispatchBuild, comment) => {
	dispatchBuild({
		type: 'EDITING_COMMENT',
		payload: comment,
	});
};

/**
 * Handles setting the build to edit in the context
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} build - the build to be edited
 */
export const setEditingBuild = (dispatchBuild, build) => {
	dispatchBuild({
		type: 'EDITING_BUILD',
		payload: build,
	});
};

/**
 * Handles cancelling a build edit. Reverts it to prev state
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} backupBuild - the backup build to reset the state to
 */
export const setCancelBuilEdit = (dispatchBuild, backupBuild) => {
	dispatchBuild({
		type: 'SET_BUILD',
		payload: {
			editingBuild: false,
			loadedBuild: backupBuild,
		},
	});
};

/**
 * Handles setting saving build state in the context
 * @param {function} dispatchBuild - The dispatch function
 * @param {bool} bool - true or false
 */
export const setSavingBuild = (dispatchBuild, bool) => {
	dispatchBuild({
		type: 'SAVING_BUILD',
		payload: bool,
	});
};

/**
 * Handles setting up deleting a comment
 * @param {function} dispatchBuild - The dispatch function
 * @param {string} commentId - The Id of the comment to delete
 */
export const setDeletingComment = (dispatchBuild, commentId) => {
	dispatchBuild({
		type: 'SET_BUILD',
		payload: {
			deletingCommentId: commentId,
		},
	});
};

/**
 * Handles setting the loaded build in context
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} loadedBuild - the loaded build
 */
export const setLoadedBuild = (dispatchBuild, loadedBuild) => {
	dispatchBuild({
		type: 'SET_BUILD',
		payload: { loadedBuild: loadedBuild, loadingBuild: false },
	});
};

/**
 * Handles setting the new build with a user goes to /upload.
 * Either takes in the standard new build, or an existing build thats being updated
 * @param {function} dispatchBuild - The dispatch function
 * @param {obj} build - The build to set
 */
export const setBuildToUpload = (dispatchBuild, build) => {
	dispatchBuild({
		type: 'SET_BUILD',
		payload: { buildToUpload: { ...build } },
	});
};

/**
 * handles clearing the build to be uploaded when a user submits an upload
 * @param {function} dispatchBuild - The dispatch function
 */
export const resetUploadBuild = dispatchBuild => {
	dispatchBuild({
		type: 'SET_BUILD',
		payload: { buildToUpload: null },
	});
};

/**
 * handles storing the id of the current build being dragged
 * @param {function} dispatchBuild - The dispatch function
 */
export const setDragBuild = (dispatchBuild, buildID) => {
	dispatchBuild({
		type: 'SET_BUILD',
		payload: { dragBuild: buildID },
	});
};
