import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { cloneDeep } from 'lodash';
//---------------------------------------------------------------------------------------------------//
import KspImage from '../../assets/kspImage.jpg';
import KspImage2 from '../../assets/kspimage-2.jpg';
import KspImage3 from '../../assets/kspimage-3.jpg';
import KspImage4 from '../../assets/kspimage-4.jpg';
import KspImage5 from '../../assets/kspimage-5.jpg';
import Button from './Button';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import BuildsContext from '../../context/builds/BuildsContext';
//---------------------------------------------------------------------------------------------------//
import ShipBuildTest from '../../utilities/shipBuildTest.json';
import shipBuildTestMedium from '../../utilities/shipBuildTestMedium.json';
import { standardBuild } from '../../utilities/standardBuild';
import useBuild from '../../context/build/BuildActions';

function CreateBuildAdmin() {
	const { user } = useContext(AuthContext);
	const { dispatchBuilds } = useContext(BuildsContext);
	const { uploadBuild } = useBuild();
	const types = ['Interplanetary', 'Interstellar', 'Satellite', 'Space Station', 'Lander', 'Rover', 'SSTO', 'Spaceplane', 'Probe'];
	/**
	 * handles creating a new fully done build
	 */
	const createBuild = async () => {
		const images = [KspImage, KspImage2, KspImage3, KspImage4, KspImage5];

		const build = cloneDeep(standardBuild);

		build.name = 'test-' + uuidv4().slice(0, 4);
		build.timestamp = serverTimestamp();
		build.description = '{"blocks":[{"key":"87rfs","text":"here is a sample description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
		build.images = [images[Math.round(Math.random() * 4)]];
		build.build = JSON.stringify(shipBuildTestMedium);
		build.author = 'nyius';
		build.uid = auth.currentUser.uid;
		build.tags = ['Interplanetary', 'SpaceX', 'Epic'];
		build.upVotes = Math.round(Math.random() * 1000);
		build.downVotes = 0;
		build.kspVersion = `1.0.0`;
		build.type = ['Interstellar', types[Math.round(Math.random() * 8)], types[Math.round(Math.random() * 8)]];
		build.commentCount = Math.round(Math.random() * 1000);
		build.views = Math.round(Math.random() * 100000);

		await uploadBuild(build);
	};

	//---------------------------------------------------------------------------------------------------//
	return <>{user?.siteAdmin && <Button color="btn-primary" text="Create Build (admin)" icon="plus" css="text-white hidden md:flex" onClick={createBuild} />}</>;
}

export default CreateBuildAdmin;
