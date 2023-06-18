import React from 'react';

/**
 * Displays a icon if theres a new message in a conversation
 * @param {*} newMessage
 * @returns
 */
function NewMessageNotif({ newMessage }) {
	if (newMessage) {
		return <div className="bg-sky-500 rounded-full w-4 h-4 shrink-0"></div>;
	}
}

export default NewMessageNotif;
