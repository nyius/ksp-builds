import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { Editor } from 'react-draft-wysiwyg';
import useCreateDraftJs from '../../../hooks/useCreateDraftJs';

/**
 * Displays the user bio
 * @returns
 */
function UserBio() {
	const { openProfile } = useAuthContext();
	const [bioState] = useCreateDraftJs(null, openProfile?.bio);

	return (
		<div className="flex flex-row gap-2 text-white">
			<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
		</div>
	);
}

export default UserBio;
