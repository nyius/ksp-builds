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
import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { giveAccoladeAndNotify } from '../../hooks/useGiveAccolade';
import { useAuthContext } from '../../context/auth/AuthContext';
import { updateUserProfilesAndDb } from '../../context/auth/AuthUtils';

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
			const buildsSnap = await getDocs(collection(db, 'builds'));

			buildsSnap.forEach(build => {
				const buildData = build.data();
				if (buildData.forChallenge) {
					updateUserProfilesAndDb(dispatchAuth, { challengesCompleted: increment(1) }, buildData.uid);
				}
			});

			// const usersSnap = await getDocs(collection(db, 'users'));
			// let accoladeToGive = fetchedAccolades?.filter(fetchedAccolade => fetchedAccolade.id === 'RHDbo0YPe0Sfm8KxBBFx'); // Build of the Week accolade

			// usersSnap.forEach(user => {
			// 	const userData = user.data();
			// 	userData.uid = user.id;

			// 	if (userData.buildOfTheWeekWinner) {
			// 		giveAccoladeAndNotify(dispatchAuth, [accoladeToGive[0]], userData);
			// 	}
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
