import React from 'react';
import { toast } from 'react-toastify';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import standardUser from '../../../../utilities/standardUser';
import standardUserProfile from '../../../../utilities/standardUserProfile';
import Button from '../../../../components/buttons/Button';
import { cloneDeep } from 'lodash';
import standardNotifications from '../../../../utilities/standardNotifications';

function AddTestUsers() {
	/**
	 * Adds 10 users to the test DB
	 */
	const addTestUsers = async () => {
		try {
			for (let i = 0; i < 10; i++) {
				let newUser = { ...standardUser };
				let newUserProfile = { ...standardUserProfile };
				let newUsername = uuidv4().slice(0, 10).replace('-', '');
				let newId = uuidv4().slice(0, 10);
				let folderName = uuidv4().slice(0, 10);
				let buildNum = uuidv4().slice(0, 10);
				let folderID = uuidv4().slice(0, 10);
				let folderUrlName = uuidv4().slice(0, 10);
				let notification = cloneDeep(standardNotifications);
				const notifId = uuidv4().slice(0, 20);
				const firstDoc = {
					id: 'first',
				};
				const today = new Date();
				const todayMonth = today.getUTCMonth() + 1; // Months are zero-indexed
				const todayDay = today.getUTCDate();

				newUser.username = newUsername;
				newUserProfile.username = newUsername;
				newUser.dateCreated = serverTimestamp();
				newUser.accountBirthMonth = todayMonth;
				newUser.accountBirthDay = todayDay;
				newUserProfile.dateCreated = serverTimestamp();
				newUserProfile.accountBirthMonth = todayMonth;
				newUserProfile.accountBirthDay = todayDay;

				newUser.folders = [{ builds: [buildNum], folderName, id: folderID, urlName: folderUrlName }];
				newUserProfile.folders = [{ builds: [buildNum], folderName, id: folderID, urlName: folderUrlName }];

				setDoc(doc(db, 'testUsers', newId), newUser);
				setDoc(doc(db, 'testUsers', newId, 'notifications', notifId), notification);
				setDoc(doc(db, 'testUsers', newId, 'messages', 'first'), firstDoc);
				setDoc(doc(db, 'testUserProfiles', newId), newUserProfile);
			}

			toast.success('Accounts Created');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-2xl 2k:text-3xl text-slate-200 font-bold">Add 10 Test Users</p>
			<Button color="btn-primary" text="Add" onClick={addTestUsers} />
		</div>
	);
}

export default AddTestUsers;
