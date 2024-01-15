import React, { useState } from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { Editor } from 'react-draft-wysiwyg';
import TextEditor from '../../../components/textEditor/TextEditor';
import EditBioBtn from './Buttons/EditBioBtn';
import CancelEditBioBtn from './Buttons/CancelEditBioBtn';
import CancelEditEmailBtn from './Buttons/CancelEditEmailBtn';
import SaveBioBtn from './Buttons/SaveBioBtn';
import EditEmailBtn from './Buttons/EditEmailBtn';
import SaveEmailBtn from './Buttons/SaveEmailBtn';
import { setEditingEmail, setVerifyEditedEmail } from '../../../context/auth/AuthActions';
import { checkMatchingEmails } from '../../../context/auth/AuthUtils';
import TextInput from '../../../components/input/TextInput';
import useCreateDraftJs from '../../../hooks/useCreateDraftJs';

/**
 * Displays the users profile info like email and bio
 * @returns
 */
function ProfileInfo() {
	const { user, editingBio, editingEmail, verifyEditedEmail, dispatchAuth } = useAuthContext();
	const [editedBio, setEditedBio] = useState(null);
	const [bioState, setBioState] = useCreateDraftJs(null, user?.bio);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-3 2k:gap-6 w-full h-full">
			<p className="text-xl 2k:text-3xl font-black text-white">{user.username}</p>

			{/* --------------------- BIO --------------------- */}
			{editingBio ? (
				<>
					<TextEditor setState={setEditedBio} />
					<div className="flex flex-row gap-4">
						<SaveBioBtn editedBio={editedBio} setBioState={setBioState} />
						<CancelEditBioBtn />
					</div>
				</>
			) : (
				<>
					<div className="relative scrollbar overflow-auto">
						<div className="rounded-lg bg-base-200 p-2 2k:p-4">
							<Editor editorState={bioState} readOnly={true} toolbarHidden={true} />
						</div>
					</div>
					<EditBioBtn />
				</>
			)}

			{/* --------------------- Email --------------------- */}
			{editingEmail !== false ? (
				<>
					<p className="text-xl 2k:text-2xl mt-4">Enter a new Email</p>
					<TextInput color="text-white" value={editingEmail} onChange={e => setEditingEmail(dispatchAuth, e.target.value)} type="email" id="email" placeholder="Enter a new email" required={true} />
					<TextInput color="text-white" value={verifyEditedEmail} onChange={e => setVerifyEditedEmail(dispatchAuth, e.target.value)} type="email" id="email" placeholder="Verify new email" required={true} />

					{editingEmail && verifyEditedEmail ? (
						<>{checkMatchingEmails(editingEmail, verifyEditedEmail) ? <p className="text-xl 2k:text-2xl italic text-emerald-500">Emails match!</p> : <p className="text-xl 2k:text-2xl italic text-red-500">Emails must match</p>}</>
					) : null}

					<div className="flex flex-row gap-4">
						<SaveEmailBtn />
						<CancelEditEmailBtn />
					</div>
				</>
			) : (
				<div className="flex flex-row gap-2 text-xl 2k:text-3xl text-white items-center h-fit">
					<span className="text-slate-400 text-xl 2k:text-2xl italic">Email:</span> {user.email} <EditEmailBtn />
				</div>
			)}
		</div>
	);
}

export default ProfileInfo;
