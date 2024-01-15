import React from 'react';
import { db } from '../../../../firebase.config';
import { doc, updateDoc, getDoc, deleteField } from 'firebase/firestore';
import Button from '../../../../components/buttons/Button';
import { toast } from 'react-toastify';

function UpdateUser() {
	/**
	 * Updates a specific user
	 */
	const updateUser = async () => {
		try {
			const userDoc = await getDoc(doc(db, 'users', 'ZyVrojY9BZU5ixp09LftOd240LH3'));
			const userProfileDoc = await getDoc(doc(db, 'users', 'ZyVrojY9BZU5ixp09LftOd240LH3'));
			const userData = userDoc.data();
			const userProfileData = userProfileDoc.data();
			userData.hangars = userData.folders;
			userProfileData.hangars = userProfileData.folders;

			delete userData.folders;
			delete userProfileData.folders;

			userData.hangars?.map(hangar => {
				hangar.hangarName = hangar.folderName;
				delete hangar.folderName;
			});

			userProfileData.hangars?.map(hangar => {
				hangar.hangarName = hangar.folderName;
				delete hangar.folderName;
			});

			await updateDoc(doc(db, 'users', 'ZyVrojY9BZU5ixp09LftOd240LH3'), { ...userData, folders: deleteField() });
			await updateDoc(doc(db, 'userProfiles', 'ZyVrojY9BZU5ixp09LftOd240LH3'), { ...userProfileData, folders: deleteField() });
			toast.success('User updated');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-2xl 2k:text-3xl text-slate-200 font-bold">Update User</p>
			<Button color="btn-primary" text="Update" onClick={updateUser} />
		</div>
	);
}

export default UpdateUser;
