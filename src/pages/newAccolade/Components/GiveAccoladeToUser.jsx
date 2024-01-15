import React, { useEffect, useState } from 'react';
import TextInput from '../../../components/input/TextInput';
import Select from '../../../components/selects/Select';
import Button from '../../../components/buttons/Button';
import { toast } from 'react-toastify';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import ConfirmGiveAccoladeModal from '../../../components/modals/ConfirmGiveAccoladeModal';
import ConfirmGiveDuplicateAccoladeModal from '../../../components/modals/ConfirmGiveDuplicateAccoladeModal';
import AccoladeSectionContainer from './AccoladeSectionContainer';
import { useParams } from 'react-router-dom';
import { useAccoladesContext } from '../../../context/accolades/AccoladesContext';

function GiveAccoladeToUser() {
	const { fetchedAccolades, accoladesLoading } = useAccoladesContext();
	const [username, setUsername] = useState('');
	const [foundUser, setFoundUser] = useState(null);
	const [giveAccolade, setGiveAccolade] = useState(false);
	const [duplicateAccolade, setDuplicateAccolade] = useState(false);
	const [selectedAccolade, setSelectedAccolade] = useState(null);
	const paramsUser = useParams().username;

	useEffect(() => {
		if (paramsUser) {
			setUsername(paramsUser);
		}
	}, [paramsUser]);

	/**
	 * Handles choosing an existing accolade
	 * @param {*} e
	 */
	const handleChooseAccolade = e => {
		setSelectedAccolade(() => {
			const foundAccolade = fetchedAccolades.filter(accolade => {
				return accolade.id === e.target.id;
			});
			return foundAccolade[0];
		});
	};

	/**
	 * handles pressing the give button. Sets the state with the required information so the confirm popup appears
	 * @returns
	 */
	const handleGiveAccolade = async () => {
		try {
			if (!username) {
				toast.error('Need to enter a username!');
				return;
			}

			if (!selectedAccolade) {
				toast.error('Need to choose an accolade!');
				return;
			}

			// Check if user exists
			const q = query(collection(db, 'users'), where('username', '==', username));
			const userSnap = await getDocs(q);

			if (userSnap.docs.length === 0) {
				toast.error(`Couldn't find user with username "${username}"`);
				return;
			}

			let foundUserInfo;
			userSnap.forEach(fetchedUser => {
				foundUserInfo = fetchedUser.data();
				foundUserInfo.uid = fetchedUser.id;
			});

			if (!foundUserInfo) {
				toast.error(`Something went wrong! user ID doesn't match found id`);
				return;
			}

			if (!foundUserInfo.accolades) {
				foundUserInfo.accolades = [];
			}

			// Check if the user already has this accolade
			if (foundUserInfo?.accolades?.length > 0) {
				for (let i = 0; i < foundUserInfo.accolades?.length; i++) {
					if (foundUserInfo.accolades[i].id === selectedAccolade.id) {
						setDuplicateAccolade(true);
					}
				}
			}

			setFoundUser(foundUserInfo);
			setGiveAccolade(true);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	const { SelectBox, Option } = Select(handleChooseAccolade, '');

	return (
		<>
			<AccoladeSectionContainer title="Give accolade to user">
				<div className="flex flex-row gap-2 2k:gap-4 items-center">
					<div className="text-xl 2k:text-2xl text-slate-400 w-44">Enter Username</div>
					<TextInput color="text-white" placeholder="Username" size="max-w-5xl" value={username} onChange={e => setUsername(e.target.value)} />
				</div>
				<div className="flex flex-row gap-2 2k:gap-4 items-center">
					<div className="text-xl 2k:text-2xl text-slate-400 w-44">Choose Accolade</div>

					<SelectBox size="w-[50rem]">
						{!accoladesLoading &&
							fetchedAccolades.map(accolade => {
								return <Option key={accolade?.id} displayText={accolade?.name} id={accolade?.id} />;
							})}
					</SelectBox>
				</div>
				<Button text="Confirm" tooltip="Opens a confirmation popup" icon="save" color="btn-primary" size="w-fit" onClick={handleGiveAccolade} />
			</AccoladeSectionContainer>
			{duplicateAccolade ? (
				<>
					<ConfirmGiveDuplicateAccoladeModal giveAccolade={giveAccolade} setGiveAccolade={setGiveAccolade} foundUser={foundUser} selectedAccolade={selectedAccolade} />
				</>
			) : (
				<ConfirmGiveAccoladeModal giveAccolade={giveAccolade} setGiveAccolade={setGiveAccolade} foundUser={foundUser} selectedAccolade={selectedAccolade} />
			)}
		</>
	);
}

export default GiveAccoladeToUser;
