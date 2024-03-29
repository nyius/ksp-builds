import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import Conversation from '../Conversation';
import Conversations from '../Conversations';
import CloseMessageBoxBtn from '../Buttons/CloseMessageBoxBtn';
import BackToConvosBtn from '../Buttons/BackToConvosBtn';
import Spinner2 from '../../spinners/Spinner2';

/**
 * Displays the popup message box with a users conversations/convo
 * @returns
 */
function MessageBox() {
	const { convosOpen, messageTab, convosLoading } = useAuthContext();

	if (convosOpen) {
		return (
			<div id="messageBox" className={`h-220 w-full sm:w-180 rounded-xl p-5 bg-base-900 !fixed ${messageTab ? '!bottom-32 2k:!bottom-38' : '!bottom-12 2k:!bottom-16'} right-2 z-[52]`}>
				<div className="relative w-full h-full flex flex-col">
					<div className="flex flex-row place-content-between h-10 items-center">
						{messageTab ? <BackToConvosBtn /> : <div className="text-xl 2k:text-2xl pixel-font">Messages</div>}
						<CloseMessageBoxBtn />
					</div>
					{convosLoading ? (
						<Spinner2 />
					) : (
						<div className="w-full conversation-size overflow-auto overflow-x-hidden scrollbar flex-nowrap absolute bottom-0 border-t-2 border-dashed border-slate-500">{messageTab ? <Conversation /> : <Conversations />}</div>
					)}
				</div>
			</div>
		);
	}
}

export default MessageBox;
