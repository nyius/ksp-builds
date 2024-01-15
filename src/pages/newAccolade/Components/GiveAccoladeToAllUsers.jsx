import React, { useState } from 'react';
import Select from '../../../components/selects/Select';
import Button from '../../../components/buttons/Button';
import { toast } from 'react-toastify';
import AccoladeSectionContainer from './AccoladeSectionContainer';
import { useAccoladesContext } from '../../../context/accolades/AccoladesContext';
import ConfirmGiveAccoladeToAllUsersModal from '../../../components/modals/ConfirmGiveAccoladeToAllUsersModal';

/**
 * Section for giving an accolade to all users on the site
 * @returns
 */
function GiveAccoladeToAllUsers() {
	const { fetchedAccolades, accoladesLoading } = useAccoladesContext();
	const [giveAccolade, setGiveAccolade] = useState(false);
	const [selectedAccolade, setSelectedAccolade] = useState(null);

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
			if (!selectedAccolade) {
				toast.error('Need to choose an accolade!');
				return;
			}

			setGiveAccolade(true);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	const { SelectBox, Option } = Select(handleChooseAccolade, '');

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<AccoladeSectionContainer title="Give accolade to all users">
				<div className="flex flex-row gap-2 2k:gap-4 items-center">
					<div className="text-xl 2k:text-2xl text-slate-400 w-44">Choose Accolade</div>

					<SelectBox size="w-[50rem]">
						{!accoladesLoading &&
							fetchedAccolades.map(accolade => {
								return <Option key={accolade?.id} displayText={accolade?.name} id={accolade?.id} />;
							})}
					</SelectBox>
				</div>
				<Button text="Confirm" icon="save" tooltip="Opens a confirmation popup" color="btn-primary" size="w-fit" onClick={handleGiveAccolade} />
			</AccoladeSectionContainer>
			<ConfirmGiveAccoladeToAllUsersModal giveAccolade={giveAccolade} setGiveAccolade={setGiveAccolade} selectedAccolade={selectedAccolade} />
		</>
	);
}

export default GiveAccoladeToAllUsers;
