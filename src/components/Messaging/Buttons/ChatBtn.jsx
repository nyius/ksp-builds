import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { setConvosOpen, useGetNewMessages } from '../../../context/auth/AuthActions';
import Button from '../../buttons/Button';

/**
 * Displays the 'Chat' button
 *
 * @returns
 */
function ChatBtn() {
	const { dispatchAuth, convosOpen } = useAuthContext();
	const [newMessages] = useGetNewMessages(0);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="fixed bottom-0 right-10 z-100 hover:border-b-4 border-primary transition-all">
			<div className="indicator">
				{newMessages !== 0 ? <span className="indicator-item badge badge-secondary z-100 text-xl p-4">{newMessages}</span> : null}
				<Button onClick={() => setConvosOpen(dispatchAuth, !convosOpen)} text="chat" icon="message" color="bg-base-900 text-white" css="shadow-xl font-bold !text-3xl" />
			</div>
		</div>
	);
}

export default ChatBtn;
