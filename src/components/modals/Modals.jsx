import React from 'react';
import CancelBuildEditModal from './CancelBuildEditModal';
import HowToCopyBuildModal from './HowToCopyBuildModal';
import HowToPasteBuildModal from './HowToPasteModal';
import LoginModal from './LoginModal';
import ResetPassword from './ResetPassword';
import NewAccountModal from './NewAccountModal';
import DeleteAccount from './DeleteAccount';
import ReportModal from './ReportModal';
import BlockModal from './BlockModal';
import SubscribeModal from './SubscribeModal';
import AddBuildToFolderModal from './AddBuildToFolderModal';
import DeleteFolderModal from './DeleteFolderModal';

/**
 * Stores (mostly) all modals
 * @returns
 */
function Modals() {
	return (
		<>
			<CancelBuildEditModal />
			<HowToCopyBuildModal />
			<HowToPasteBuildModal />
			<LoginModal />
			<NewAccountModal />
			<ResetPassword />
			<ReportModal />
			<DeleteAccount />
			<DeleteFolderModal />
			<BlockModal />
			<SubscribeModal />
			<AddBuildToFolderModal />
		</>
	);
}

export default Modals;
