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
import WhatIsFolderModal from './WhatIsFolderModal';
import FolderLimitModal from './FolderLimitModal';

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
			<WhatIsFolderModal />
			<FolderLimitModal />
		</>
	);
}

export default Modals;
