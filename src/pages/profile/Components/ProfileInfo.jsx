import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import { Editor } from 'react-draft-wysiwyg';
import TextEditor from '../../../components/textEditor/TextEditor';
import EditBioBtn from './Buttons/EditBioBtn';
import CancelEditBioBtn from './Buttons/CancelEditBioBtn';
import SaveBioBtn from './Buttons/SaveBioBtn';
import checkIfJson from '../../../utilities/checkIfJson';
import { convertFromRaw, EditorState, ContentState } from 'draft-js';

function ProfileInfo() {
	const { user, editingProfile, authLoading } = useContext(AuthContext);
	const [editedBio, setEditedBio] = useState(null);
	const [bioState, setBioState] = useState(null);

	useEffect(() => {
		if (!authLoading) {
			if (checkIfJson(user?.bio)) {
				setBioState(EditorState.createWithContent(convertFromRaw(JSON.parse(user?.bio))));
			} else {
				setBioState(EditorState.createWithContent(ContentState.createFromText(user?.bio)));
			}
		}
	}, [authLoading]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-3 2k:gap-6 w-full">
			{/* Username */}
			<p className="text-xl 2k:text-3xl font-thin text-white">
				<span className="text-slate-400 text-xl 2k:text-2xl italic">Username: </span> {user.username}
			</p>

			{editingProfile ? (
				<>
					<TextEditor setState={setEditedBio} />

					<div className="flex flex-row gap-4">
						<SaveBioBtn editedBio={editedBio} setBioState={setBioState} />
						<CancelEditBioBtn />
					</div>
				</>
			) : (
				<>
					<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
					<EditBioBtn />
				</>
			)}

			<p className="text-xl 2k:text-3xl mt-10 text-white">
				<span className="text-slate-400 text-xl 2k:text-2xl italic">Email:</span> {user.email}
			</p>
		</div>
	);
}

export default ProfileInfo;
