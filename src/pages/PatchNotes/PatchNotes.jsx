import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase.config';
import { doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import AuthContext from '../../context/auth/AuthContext';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Spinner1 from '../../components/spinners/Spinner1';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import DeletePatchNotesModal from '../../components/modals/DeletePatchNoteModal';
import TextEditor from '../../components/textEditor/TextEditor';
import Helmet from '../../components/Helmet/Helmet';
import DeletePatchNoteBtn from './Components/Buttons/DeletePatchNoteBtn';
import CheckCredentials from '../../components/credentials/CheckCredentials';

/**
 * KSP Builds Patch notes Page
 * @returns
 */
function PatchNotes() {
	const { user, authLoading } = useContext(AuthContext);
	const [patchNotes, setPatchNotes] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editingPatchNotes, setEditingPatchNotes] = useState(null);
	const [editedPatchNotes, setEditedPatchNote] = useState(null);

	useEffect(() => {
		const fetchPatchNotes = async () => {
			try {
				let data = [];

				const patchSnap = await getDocs(collection(db, 'patchNotes'));

				patchSnap.forEach(note => {
					const noteData = note.data();
					noteData.id = note.id;
					data.push(noteData);
				});

				const sortedPatchNotes = data.sort((a, b) => {
					let aDate = a.timestamp.seconds;
					let bDate = b.timestamp.seconds;

					return aDate < bDate ? 1 : -1;
				});

				setPatchNotes(sortedPatchNotes);
				setLoading(false);
			} catch (error) {
				console.log(error);
				toast.error("Couldn't fetch patch notes");
				setLoading(false);
			}
		};
		fetchPatchNotes();
	}, []);

	/**
	 * Handles updates
	 */
	const updatePatchNote = async id => {
		try {
			await updateDoc(doc(db, 'patchNotes', id), { patchNote: editedPatchNotes });
			toast.success('Patch note updated!');

			setEditingPatchNotes(null);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong updating those notes');
		}
	};

	if (loading) {
		return (
			<MiddleContainer>
				<Spinner1 />
			</MiddleContainer>
		);
	}

	if (!loading && !patchNotes) {
		return (
			<MiddleContainer>
				<CantFind text="No patch notes found" />
			</MiddleContainer>
		);
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Patch Notes" pageLink="https://kspbuilds.com/patch-notes" />

			<MiddleContainer>
				<PlanetHeader text="KSP Builds Patch Notes" />

				<div className="flex flex-col gap-4 2k:gap-8">
					{patchNotes.map((patchNote, i) => {
						return (
							<div key={i} className="bg-base-600 rounded-xl p-10 2k:p-16">
								<h2 className="font-bold text-2xl 2k:text-4xl text-white">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(patchNote.timestamp.seconds * 1000)}</h2>
								{editingPatchNotes !== patchNote.id && <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(patchNote.patchNote)))} readOnly={true} toolbarHidden={true} />}
								{editingPatchNotes === patchNote.id && <TextEditor text={patchNote.patchNote} setState={setEditedPatchNote} />}

								<CheckCredentials type="admin">
									<div className="flex flex-row gap-2 2k:gap-4">
										<DeletePatchNoteBtn id={patchNote.id} />
										{editingPatchNotes !== patchNote.id && <Button text="Edit" icon="edit" onClick={() => setEditingPatchNotes(patchNote.id)} />}
										{editingPatchNotes === patchNote.id && <Button text="Save" color="btn-primary" icon="save" onClick={() => updatePatchNote(patchNote.id)} />}
										{editingPatchNotes === patchNote.id && <Button text="Cancel" color="btn-error" icon="cancel" onClick={() => setEditingPatchNotes(null)} />}
									</div>
								</CheckCredentials>
							</div>
						);
					})}
				</div>
			</MiddleContainer>
			<DeletePatchNotesModal />
		</>
	);
}

export default PatchNotes;
