import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import { Editor } from 'react-draft-wysiwyg';
import checkIfJson from '../../../utilities/checkIfJson';
import { convertFromRaw, EditorState, ContentState } from 'draft-js';

/**
 * Displays the user bio
 * @returns
 */
function UserBio() {
	const { openProfile } = useContext(AuthContext);
	const [bioState, setBioState] = useState(null);

	useEffect(() => {
		if (checkIfJson(openProfile?.bio)) {
			setBioState(EditorState.createWithContent(convertFromRaw(JSON.parse(openProfile?.bio))));
		} else {
			setBioState(EditorState.createWithContent(ContentState.createFromText(openProfile?.bio)));
		}
	}, [openProfile]);

	return (
		<div className="flex flex-row gap-2 text-white">
			<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
		</div>
	);
}

export default UserBio;
