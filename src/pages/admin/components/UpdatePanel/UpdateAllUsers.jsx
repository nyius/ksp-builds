import React from 'react';
import { toast } from 'react-toastify';
import { doc, collection, getDocs, updateDoc, deleteField, serverTimestamp, increment } from 'firebase/firestore';
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

				if (userData.dateCreated?.seconds) {
					const accountBirthdayMs = userData.dateCreated?.seconds * 1000;
					const birthdate = new Date(accountBirthdayMs);
					const accountMonth = birthdate.getUTCMonth() + 1; // Months are zero-indexed
					const accountDay = birthdate.getUTCDate();

					updateDoc(doc(db, 'users', user.id), { accountBirthMonth: accountMonth, accountBirthDay: accountDay });
					updateDoc(doc(db, 'userProfiles', user.id), { accountBirthMonth: accountMonth, accountBirthDay: accountDay });
				}
			});

			toast.success('All users updated!');
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row items-center gap-4">
			<p className="text-2xl 2k:text-3xl text-slate-200 font-bold">Upate all Users!</p>
			<Button color="btn-primary" text="Update" onClick={updateAllUsers} />
		</div>
	);
}

export default UpdateAllUsers;
