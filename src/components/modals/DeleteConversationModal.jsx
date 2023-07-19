import React from 'react';
import { useDeleteConversation } from '../../context/auth/AuthActions';
import Button from '../buttons/Button';
import { useAuthContext } from '../../context/auth/AuthContext';
import PlanetHeader from '../header/PlanetHeader';

function DeleteConversationModal() {
	const { deleteConversation } = useDeleteConversation();
	const { deleteConvoId } = useAuthContext();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<input type="checkbox" id="delete-conversation-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<Button htmlFor="delete-conversation-modal" style="btn-circle" position="z-50 absolute right-2 top-2" text="X" />
					<PlanetHeader text="Delete Conversation"></PlanetHeader>
					<h4 className="text-xl 2k:text-3xl text-slate-100 text-center mb-10 2k:mb-16">Are you sure you want to delete this Conversation?</h4>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-conversation-modal" color="btn-success" text="Cancel" icon="cancel" />
						<Button htmlFor="delete-conversation-modal" color="btn-error" onClick={() => deleteConversation(deleteConvoId)} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteConversationModal;
