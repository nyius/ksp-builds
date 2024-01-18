import React, { useEffect, useState } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import DeleteAccoladeModal from '../../components/modals/DeleteAccoladeModal';
import GiveAccoladeToUser from './Components/GiveAccoladeToUser';
import RemoveAccoladeFromUser from './Components/RemoveAccoladeFromUser';
import NewAccolade from './Components/NewAccolade';
import ExistingAccolade from './Components/ExistingAccolade';
import { deleteAccolade } from '../../context/accolades/AccoladesActions';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import GiveAccoladeToAllUsers from './Components/GiveAccoladeToAllUsers';
import Button from '../../components/buttons/Button';
import { collection, doc, getDoc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { giveAccoladeAndNotify } from '../../hooks/useGiveAccolade';
import { useAuthContext } from '../../context/auth/AuthContext';
import { updateUserProfilesAndDb } from '../../context/auth/AuthUtils';
import { checkAndAwardAccoladeGroup } from '../../context/accolades/AccoladesUtils';

/**
 * Accolade dashboard page
 * @returns
 */
function AccoladeDashboard() {
	const { dispatchAccolades, fetchedAccolades } = useAccoladesContext();
	const { dispatchAuth } = useAuthContext();
	const [selectedAccolade, setSelectedAccolade] = useState(null);
	const [deleteSuccess, setDeleteSuccess] = useState(null);

	useEffect(() => {
		if (deleteSuccess) {
			deleteAccolade(dispatchAccolades, selectedAccolade.id);
			setSelectedAccolade(false);
		}
	}, [deleteSuccess]);

	/**
	 *
	 */
	const giveSpecificAccolade = async () => {
		try {
			const usersSnap = await getDocs(collection(db, 'users'));

			// let fetchedUsers = {};
			// usersSnap.forEach(user => {
			// 	const buildData = user.data();
			// 	fetchedUsers[buildData.uid] = buildData.uid;
			// });

			// for (const user in fetchedUsers) {
			// 	const fetchConvoUserAndAwardAccolade = async () => {
			// 		const fetchedUser = await getDoc(doc(db, 'users', user));

			// 		if (fetchedUser.exists()) {
			// 			let fetchedUserData = fetchedUser.data();
			// 			fetchedUserData.uid = fetchedUser.id;

			// 			const hasMaidenVoyagerAccolade = fetchedUserData.accolades?.some(accolade => accolade.id === 'YdT1ACrDyAtGE0cfraAn');

			// 			if (!hasMaidenVoyagerAccolade) {
			// 				let accoladeToGive;
			// 				accoladeToGive = fetchedAccolades?.filter(fetchedAccolade => fetchedAccolade.id === 'YdT1ACrDyAtGE0cfraAn'); // first contact accoalde
			// 				await giveAccoladeAndNotify(dispatchAuth, [accoladeToGive[0]], fetchedUserData);
			// 			}
			// 		}
			// 	};

			// 	fetchConvoUserAndAwardAccolade();
			// }
			// const buildData = build.data();
			// 	if (buildData.forChallenge) {
			// 		updateUserProfilesAndDb(dispatchAuth, { challengesCompleted: increment(1) }, buildData.uid);
			// 	}

			// let accoladeToGive = fetchedAccolades?.filter(fetchedAccolade => fetchedAccolade.id === 'RHDbo0YPe0Sfm8KxBBFx'); // Build of the Week accolade

			usersSnap.forEach(user => {
				const userData = user.data();
				userData.uid = user.id;

				// if (userData.buildOfTheWeekWinner) {
				// 	giveAccoladeAndNotify(dispatchAuth, [accoladeToGive[0]], userData);
				// }
				if (userData.builds) {
					checkAndAwardAccoladeGroup(
						dispatchAuth,
						userData,
						fetchedAccolades,
						{
							diamond: {
								id: '4taBSe5XQpLnekwOzywg',
								minPoints: 50,
							},
							platinum: {
								id: 'Fx1ZDwMTqqDsFWxZa0XC',
								minPoints: 40,
							},
							gold: {
								id: 'JAi1AC9FmDjEFs9ZtGNA',
								minPoints: 30,
							},
							silver: {
								id: 'DoGHYVMglrGXOb5NNLCN',
								minPoints: 20,
							},
							bronze: {
								id: 'h6WZjITG8BZRXV8T2MAt',
								minPoints: 10,
							},
						},
						userData.builds?.length
					);
				}
			});

			// comments.push(getDocs(collection(db, 'builds', build.id, 'comments')).then(res => res.docs.map(res => res.data())));
			// const fetchedComments = await Promise.all(comments);
			// const allComments = fetchedComments.flat();
			// allComments.map(comment => {
			// 	updateUserProfilesAndDb(dispatchAuth, { commentCount: increment(1) }, comment.uid);
			// });

			toast.success('All users updated!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Accolade Dashboard" />
			<div className="w-full flex flex-col gap-12 2k:gap-16">
				<Button text="Give backend accolade || ONLY PUSH IF NYIUS" icon="save" size="w-fit" onClick={giveSpecificAccolade} color="btn-primary" />
				<NewAccolade />

				<ExistingAccolade selectedAccolade={selectedAccolade} setSelectedAccolade={setSelectedAccolade} />

				<GiveAccoladeToUser />
				<GiveAccoladeToAllUsers />
				<RemoveAccoladeFromUser />
			</div>
			<DeleteAccoladeModal accoladeId={selectedAccolade ? selectedAccolade.id : ''} setDeleteSuccess={setDeleteSuccess} />
		</MiddleContainer>
	);
}

export default AccoladeDashboard;
