import React from 'react';
import CancelBuildEditModal from './CancelBuildEditModal';
import DeleteBuildModal from './DeleteBuildModal';
import HowToCopyBuildModal from './HowToCopyBuildModal';
import HowToPasteBuildModal from './HowToPasteModal';
import LoginModal from './LoginModal';
import ResetPassword from './ResetPassword';
import NewAccountModal from './NewAccountModal';
import DeleteAccount from './DeleteAccount';

function Modals() {
	return (
		<>
			<CancelBuildEditModal />
			<HowToCopyBuildModal />
			<HowToPasteBuildModal />
			<LoginModal />
			<NewAccountModal />
			<ResetPassword />
			<DeleteAccount />
		</>
	);
}

export default Modals;
