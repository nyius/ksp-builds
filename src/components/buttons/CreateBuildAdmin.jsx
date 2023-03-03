import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../firebase.config';
import KspImage from '../../assets/kspImage.jpg';
import KspImage2 from '../../assets/kspimage-2.jpg';
import KspImage3 from '../../assets/kspimage-3.jpg';
import KspImage4 from '../../assets/kspimage-4.jpg';
import KspImage5 from '../../assets/kspimage-5.jpg';
import ShipBuildTest from '../../utilities/shipBuildTest.json';
import shipBuildTestMedium from '../../utilities/shipBuildTestMedium.json';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/AuthContext';
import BuildsContext from '../../context/builds/BuildsContext';

function CreateBuildAdmin() {
	const { user } = useContext(AuthContext);
	const { dispatchBuilds } = useContext(BuildsContext);
	const types = ['Interplanetary', 'Interstellar', 'Satellite', 'Space Station', 'Lander', 'Rover', 'SSTO', 'Spaceplane', 'Probe'];
	/**
	 * handles creating a new fully done build
	 */
	const createBuild = async () => {
		const buildId = uuidv4().slice(0, 20);
		const images = [KspImage, KspImage2, KspImage3, KspImage4, KspImage5];

		const build = {
			name: 'test-' + uuidv4().slice(0, 4),
			timestamp: serverTimestamp(),
			description: 'Here is a random description!',
			image: images[Math.round(Math.random() * 4)],
			build: JSON.stringify(shipBuildTestMedium),
			author: 'nyius',
			uid: auth.currentUser.uid,
			tags: ['Interplanetary', 'SpaceX', 'Epic'],
			upVotes: Math.round(Math.random() * 1000),
			downVotes: 0,
			kspVersion: `1.0.0`,
			type: types[Math.round(Math.random() * 8)],
			comments: Math.round(Math.random() * 1000),
			id: buildId,
			views: Math.round(Math.random() * 1000),
		};

		const commentInit = {};

		await setDoc(doc(db, 'builds', buildId), build);
		await setDoc(doc(db, 'builds', buildId, 'comments', uuidv4().slice(0, 20)), commentInit);

		// now get the document so we can grab its timestamp
		const ref = doc(db, 'builds', buildId);
		const data = await getDoc(ref);

		if (data.exists()) {
			const loadedBuild = data.data();
			build.timestamp = loadedBuild.timestamp;

			// add the build to the list of fetched builds
			dispatchBuilds({
				type: 'ADD_BUILD',
				payload: build,
			});

			toast.success('Build created');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{user?.siteAdmin && (
				<div className="btn btn-error text-white" onClick={createBuild}>
					Create Build
				</div>
			)}
		</>
	);
}

export default CreateBuildAdmin;
