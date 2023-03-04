import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

/**
 * Handles uploading a build to the server. Takes in a build, and a dispatch function to add the newly created build to
 * @param {*} dispatchBuilds
 * @param {*} build
 */
const uploadBuild = async (dispatchBuilds, build) => {
	try {
		const buildId = uuidv4().slice(0, 30);
		build.id = buildId;

		const commentInit = {};

		const rawBuild = { build: build.build };
		delete build.build;

		await setDoc(doc(db, 'builds', buildId), build);
		await setDoc(doc(db, 'builds', buildId, 'comments', uuidv4().slice(0, 20)), commentInit);

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

			await setDoc(doc(db, 'buildsRaw', buildId), rawBuild);

			toast.success('Build created!');
			return newId;
		}
	} catch (error) {
		console.log(error);
	}
};

export default uploadBuild;
