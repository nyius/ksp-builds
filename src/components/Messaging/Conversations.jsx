import React, { useRef, Fragment } from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import { setConvoTab, setDeleteConversationId, useSetConversations } from '../../context/auth/AuthActions';
import { readMessage } from '../../context/auth/AuthUtils';
import ConvosAvatar from './Components/ConvosAvatar';
import ConvosTimestamp from './Components/ConvosTimestamp';
import DeleteConvoBtn from './Buttons/DeleteConvoBtn';
import NewMessageNotif from './Components/NewMessageNotif';
import ConvosUsername from './Components/ConvosUsername';
import ConvosLastMessage from './Components/ConvosLastMessage';
import { useScrollToElement } from '../../hooks/ScrollToElement';

/**
 * Displays the users list of conversations with other users
 * @returns
 */
function Conversations() {
	const { dispatchAuth, user } = useAuthContext();
	const messagesTopTef = useRef(null);
	const [convos] = useSetConversations([]);

	useScrollToElement(messagesTopTef);

	/**
	 * Handles opening a convo up
	 * @param {*} convo
	 */
	const handleOpenConvo = (convo, e) => {
		if (!e.target.htmlFor) {
			setConvoTab(dispatchAuth, convo);
			readMessage(convo.id, user.uid);
		} else {
			setDeleteConversationId(dispatchAuth, convo.id);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (convos?.length === 0) {
		return <p className="text-xl 2k:text-3xl text-white text-center">No messages yet!</p>;
	}

	return (
		<>
			<div ref={messagesTopTef} />
			{convos.map((message, i) => {
				return (
					<Fragment key={i}>
						{message?.messages?.length > 0 && (
							<div key={i} className="flex flex-row gap-2 2k:gap-4 items-center rounded-xl py-2 2k:py-4 hover:bg-primary cursor-pointer relative" onClick={e => handleOpenConvo(message, e)}>
								<ConvosAvatar profilePicture={message.userProfilePic} />
								<div className="flex flex-col w-full">
									<div className="flex flex-row w-full place-content-between pr-9">
										<ConvosUsername username={message.username} />
										<div className="flex flex-row pr-6 shrink-0 items-center">
											<ConvosTimestamp timestamp={message.lastMessage} />
											<NewMessageNotif newMessage={message.newMessage} />
										</div>
									</div>
									<ConvosLastMessage message={message} />
								</div>
								<DeleteConvoBtn />
							</div>
						)}
					</Fragment>
				);
			})}
		</>
	);
}

export default Conversations;
