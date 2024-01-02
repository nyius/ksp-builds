import React from 'react';
import { toast } from 'react-toastify';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import standardUser from '../../../../utilities/standardUser';
import standardUserProfile from '../../../../utilities/standardUserProfile';
import Button from '../../../../components/buttons/Button';

function AddTestUsers() {
	/**
	 * Adds 10 users to the test DB
	 */
	const addTestUsers = async () => {
		try {
			for (let i = 0; i < 10; i++) {
				let newUser = { ...standardUser };
				let newUserProfile = { ...standardUserProfile };
				let newUsername = uuidv4().slice(0, 10);
				let newId = uuidv4().slice(0, 10);
				let folderName = uuidv4().slice(0, 10);
				let buildNum = uuidv4().slice(0, 10);
				let folderID = uuidv4().slice(0, 10);
				let folderUrlName = uuidv4().slice(0, 10);

				newUser.username = newUsername;
				newUserProfile.username = newUsername;
				newUser.dateCreated = serverTimestamp();
				newUserProfile.dateCreated = serverTimestamp();

				newUser.folders = [{ builds: [buildNum], folderName, id: folderID, urlName: folderUrlName }];
				newUserProfile.folders = [{ builds: [buildNum], folderName, id: folderID, urlName: folderUrlName }];

				await setDoc(doc(db, 'testUsers', newId), newUser);
				await setDoc(doc(db, 'testUserProfiles', newId), newUserProfile);
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<div className="flex flex-col gap-4 place-content-between">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Add 10 Test Users</p>
			<Button color="btn-primary" text="Add" onClick={addTestUsers} />
		</div>
	);
}

export default AddTestUsers;
