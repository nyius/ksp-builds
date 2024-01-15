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

/**
 * Accolade dashboard page
 * @returns
 */
function AccoladeDashboard() {
	const { dispatchAccolades } = useAccoladesContext();
	const [selectedAccolade, setSelectedAccolade] = useState(null);
	const [deleteSuccess, setDeleteSuccess] = useState(null);

	useEffect(() => {
		if (deleteSuccess) {
			deleteAccolade(dispatchAccolades, selectedAccolade.id);
			setSelectedAccolade(false);
		}
	}, [deleteSuccess]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Accolade Dashboard" />
			<div className="w-full flex flex-col gap-12 2k:gap-16">
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
