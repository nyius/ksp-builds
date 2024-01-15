import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../firebase.config';
import TextInput from '../../../components/input/TextInput';
import Button from '../../../components/buttons/Button';
import Spinner2 from '../../../components/spinners/Spinner2';
import RemoveAccoladeFullIcon from './RemoveAccoladeFullIcon';
import DeleteUsersAccoladeModal from '../../../components/modals/DeleteUsersAccoladeModal';
import AccoladeSectionContainer from './AccoladeSectionContainer';

function RemoveAccoladeFromUser() {
	const [fetchingUserToRemove, setFetchingUserToRemove] = useState(false);
	const [username, setUsername] = useState('');
	const [userToRemoveAccolade, setUserToRemoveAccolade] = useState(null);
	const [selectedAccolades, setSelectedAccolades] = useState([]);
	const [confirmDeleteAccolades, setConfirmDeleteAccolades] = useState(false);

	/**
	 * Handles getting the user whose accolade we want to remove
	 * @returns
	 */
	const handleFetchUserToRemove = async () => {
		try {
			if (!username) {
				toast.error('Need to enter a username!');
				return;
			}
			setFetchingUserToRemove(true);

			// Check if user exists
			const q = query(collection(db, 'users'), where('username', '==', username));
			const userSnap = await getDocs(q);

			if (userSnap.docs.length == 0) {
				toast.error(`Couldn't find user with username "${username}"`);
				return;
			}

			let foundUserInfo;
			userSnap.forEach(fetchedUser => {
				const userData = fetchedUser.data();
				userData.uid = fetchedUser.id;
				foundUserInfo = userData;
			});

			if (!foundUserInfo) {
				toast.error(`Something went wrong! user ID doesn't match found id`);
				return;
			}

			setUserToRemoveAccolade(foundUserInfo);
			setFetchingUserToRemove(false);
		} catch (error) {
			toast.error('Something went wrong fetching user');
			console.log(error);
		}
	};

	return (
		<>
			<AccoladeSectionContainer title="Remove a Users Accolade">
				<TextInput color="text-white" placeholder="Username" onChange={e => setUsername(e.target.value)} />

				{!fetchingUserToRemove && userToRemoveAccolade ? (
					<div className="flex flex-row w-full gap-5 2k:gap-10 flex-wrap">
						{userToRemoveAccolade.accolades.length > 0 ? (
							<>
								{userToRemoveAccolade.accolades.map((accolade, i) => {
									return <RemoveAccoladeFullIcon key={accolade?.dateReceived.seconds} i={i} accolade={accolade} selectedAccolades={selectedAccolades} setSelectedAccolades={setSelectedAccolades} />;
								})}
							</>
						) : (
							<div className="text-2xl 2k:text-3xl text-slate-200 ">User has no accolades!</div>
						)}
					</div>
				) : (
					''
				)}
				{fetchingUserToRemove ? <Spinner2 /> : ''}

				<div className="flex flex-row gap-2 2k:gap-4">
					{selectedAccolades.length > 0 ? <Button text={`Remove Accolade${selectedAccolades.length > 1 ? 's' : ''}`} icon="delete" color="btn-success" size="w-fit" onClick={() => setConfirmDeleteAccolades(true)} /> : ''}

					<Button text="Fetch User" icon="export" color="btn-primary" size="w-fit" onClick={handleFetchUserToRemove} />
				</div>
			</AccoladeSectionContainer>
			{confirmDeleteAccolades ? (
				<DeleteUsersAccoladeModal
					selectedAccolades={selectedAccolades}
					setSelectedAccolades={setSelectedAccolades}
					user={userToRemoveAccolade}
					setUserToRemoveAccolade={setUserToRemoveAccolade}
					setConfirmDeleteAccolades={setConfirmDeleteAccolades}
				/>
			) : (
				''
			)}
		</>
	);
}

export default RemoveAccoladeFromUser;
