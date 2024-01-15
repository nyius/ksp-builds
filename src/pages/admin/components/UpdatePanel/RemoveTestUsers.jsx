import React from 'react';
import { toast } from 'react-toastify';
import { doc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import Button from '../../../../components/buttons/Button';

function RemoveTestUsers() {
	/**
	 * Adds 10 users to the test DB
	 */
	const removeTestUsers = async () => {
		try {
			const testUsersSnap = await getDocs(collection(db, 'testUsers'));

			testUsersSnap.forEach(user => {
				const id = user.id;

				deleteDoc(doc(db, 'testUsers', id));
				deleteDoc(doc(db, 'testUserProfiles', id));
			});

			toast.success('Accounts deleted!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-2xl 2k:text-3xl text-slate-200 font-bold">Remove all Test Users</p>
			<Button color="btn-primary" text="Remove" onClick={removeTestUsers} />
		</div>
	);
}

export default RemoveTestUsers;
