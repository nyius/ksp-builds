import React, { useContext } from 'react';
import useAuth from '../../context/auth/AuthActions';
import Button from '../buttons/Button';
import { useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext';

function DeleteConversationModal() {
	const { deleteConversation } = useAuth();
	const { deleteConvoId } = useContext(AuthContext);

	return (
		<>
			<input type="checkbox" id="delete-conversation-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<Button htmlFor="delete-conversation-modal" style="btn-circle" position="absolute right-2 top-2" text="X" />
					<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete Conversation</h3>
					<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this Conversation?</h4>
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