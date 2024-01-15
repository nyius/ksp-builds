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
		<div className="flex flex-row gap-2 scrollbar overflow-auto rounded-lg bg-base-200 p-2 2k:p-4 text-white">
			<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
		</div>
	);
}

export default UserBio;
