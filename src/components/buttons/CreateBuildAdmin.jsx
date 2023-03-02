import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../firebase.config';
import KspImage from '../../assets/kspImage.jpg';
import ShipBuildTest from '../../utilities/shipBuildTest.json';
import shipBuildTestMedium from '../../utilities/shipBuildTestMedium.json';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/AuthContext';

function CreateBuildAdmin() {
	const { user } = useContext(AuthContext);
	/**
	 * handles creating a new fully done build
	 */
	const createBuild = async () => {
		const buildId = uuidv4().slice(0, 20);

		const build = {
			name: 'test-' + uuidv4().slice(0, 4),
			timestamp: serverTimestamp(),
			description: 'Here is a random description!',
			image: KspImage,
			build: JSON.stringify(shipBuildTestMedium),
			author: 'nyius',
			uid: auth.currentUser.uid,
			tags: ['Interplanetary', 'SpaceX', 'Epic'],
			upVotes: 1,
			downVotes: 0,
		};

		const commentInit = {};

		await setDoc(doc(db, 'builds', buildId), build);
		await setDoc(doc(db, 'builds', buildId, 'comments', uuidv4().slice(0, 20)), commentInit);
		toast.success('Build created');
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
