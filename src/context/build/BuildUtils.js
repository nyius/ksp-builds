import { doc, updateDoc, increment, query, where, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { buildNameToUrl } from '../../utilities/buildNameToUrl';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { profanity } from '@2toad/profanity';

/**
 * Handles updating the builds view count
 * @param {string} id - the id of the build to update
 */
export const updateDownloadCount = async id => {
	try {
		const ref = doc(db, process.env.REACT_APP_BUILDSDB, id);
		await updateDoc(ref, { downloads: increment(1) });
	} catch (error) {
		console.log(error);
	}
};

/**
 * handles updating the builds view count
 * @param {object} build - the build to update view count for
 */
export const updateViewCount = async build => {
	try {
		const ref = doc(db, process.env.REACT_APP_BUILDSDB, build.id);
		await updateDoc(ref, { views: increment(1) });
	} catch (error) {
		console.log(error);
	}
};

/**
 * Handles upading the comment on the DB
 * @param {string} comment - The updated comment
 * @param {string} commentId - The id of the comment
 * @param {string} buildId - the id of the build the comment is on
 */
export const updateComment = async (comment, commentId, buildId) => {
	try {
		const ref = doc(db, process.env.REACT_APP_BUILDSDB, buildId, 'comments', commentId);

		await updateDoc(ref, { comment, edited: serverTimestamp() });

		toast.success('Comment Edited');
	} catch (error) {
		console.log(error);
		toast.error('Something went wrong with editing your comment. Please try again');
	}
};

/**
 * Hadles saving the new build to the server
 * @param {object} build - takes in a build to check if its ready to upload
 * @returns the build
 */
export const makeBuildReadyToUpload = async build => {
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
 * Handles recursively checking the database with the proposed build URL. if it finds a build with the same name,
 * it goes again while appending an incremented number to the end until we get a unique url.
 * @param {int} num - Number to start the search at, 0 would be standard
 * @param {obj} buildName - the name of the build to check
 * @returns the number to append to the end. 0 will mean we have a unique name
 */
export const searchBuilds = async (num, buildName) => {
	try {
		const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
		let q;

		if (num === 0) {
			q = query(buildsRef, where('urlName', '==', buildNameToUrl(buildName)));
		} else {
			q = query(buildsRef, where('urlName', '==', buildNameToUrl(`${buildName}-${num}`)));
		}

		const fetchedBuilds = await getDocs(q);
		const builds = [];

		fetchedBuilds.forEach(doc => {
			builds.push(doc.data());
		});

		if (builds.length > 0) {
			return searchBuilds(num + 1);
		} else {
			return num;
		}
	} catch (error) {
		throw new Error(error);
	}
};
