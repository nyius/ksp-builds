import React from 'react';
import { toast } from 'react-toastify';
import { doc, collection, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import Button from '../../../../components/buttons/Button';

function UpdateAllUsers() {
	/**
	 * Some function to update all users
	 */
	const updateAllUsers = async () => {
		try {
			const usersRef = collection(db, 'users');
			const usersSnap = await getDocs(usersRef);

			usersSnap.forEach(user => {
				const userData = user.data();

				if (userData.folders) {
					userData.hangars = userData.folders;

					userData.hangars.map(hangar => {
						hangar.hangarName = hangar.folderName;
						delete hangar.folderName;
					});
					updateDoc(doc(db, 'users', user.id), { hangars: userData.hangars, folders: deleteField() });
					updateDoc(doc(db, 'userProfiles', user.id), { hangars: userData.hangars, folders: deleteField() });
				}
			});

			toast.success('All users updated!');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex flex-col gap-4 place-content-between">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Upate all Users</p>
			<Button color="btn-primary" text="Update" onClick={updateAllUsers} />
		</div>
	);
}

export default UpdateAllUsers;