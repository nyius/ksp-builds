import React from 'react';
import CancelBuildEditModal from './CancelBuildEditModal';
import DeleteBuildModal from './DeleteBuildModal';
import HowToCopyBuildModal from './HowToCopyBuildModal';
import HowToPasteBuildModal from './HowToPasteModal';
import LoginModal from './LoginModal';
import NewAccountModal from './NewAccountModal';

function Modals() {
	return (
		<>
			<CancelBuildEditModal />
			<HowToCopyBuildModal />
			<HowToPasteBuildModal />
			<LoginModal />
			<NewAccountModal />
		</>
	);
}

export default Modals;
