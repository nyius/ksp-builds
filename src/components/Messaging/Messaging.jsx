import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import DeleteConversationModal from '../modals/DeleteConversationModal';
import ChatBtn from './Buttons/ChatBtn';
import MessageBox from './Components/MessageBox';
import MessageInput from './Components/MessageInput';

/**
 * Displays all conversations/messages/messaging button
 * @returns
 */
function Messaging() {
	const { authLoading, user } = useContext(AuthContext);

	//---------------------------------------------------------------------------------------------------//
	if (!authLoading && user?.username) {
		return (
			<>
				<div>
					<ChatBtn />
					<MessageBox />
					<MessageInput />
				</div>
				<DeleteConversationModal />
			</>
		);
	}
}

export default Messaging;
