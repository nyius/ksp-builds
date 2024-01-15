import React, { useState } from 'react';
import Button from '../../../components/buttons/Button';
import { toast } from 'react-toastify';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { sendSiteMessage } from '../utils/sendNotification';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '../../../context/auth/AuthContext';
import TextEditor from '../../../components/textEditor/TextEditor';
import SectionContainer from './SectionContainer';

function CreatePatchNote() {
	const [patchNotes, setPatchNotes] = useState('');
	const [patchNotesNotif, setPatchNotesNotif] = useState('');
	const { user } = useAuthContext();

	/**
	 * Handles uploading patch note
	 */
	const uploadPatchNote = async () => {
		try {
			if (patchNotesNotif === '') {
				console.log(`Forgot patch notif`);
				toast.error(`Forgot patch notif`);
				return;
			}
			await setDoc(doc(db, 'patchNotes', uuidv4().slice(0, 15)), { patchNote: patchNotes, timestamp: serverTimestamp() });
			await sendSiteMessage(patchNotesNotif, 'update', user);

			toast.success('Patch note update!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong creating patch note');
		}
	};

	return (
		<SectionContainer css="!flex-col gap-4" sectionName="Create Patch Note">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Create Patch Notes</p>
			<p className="text-2xl 2k:text-4xl text-slate-200">Notif</p>
			<TextEditor setState={setPatchNotesNotif} />
			<p className="text-2xl 2k:text-4xl text-slate-200">Patch Note</p>
			<TextEditor characterLimit={3000} setState={setPatchNotes} />
			<Button text="create" color="btn-primary" icon="upload" size="w-fit" onClick={uploadPatchNote} />
		</SectionContainer>
	);
}

export default CreatePatchNote;
