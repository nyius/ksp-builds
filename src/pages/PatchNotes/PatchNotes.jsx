import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase.config';
import { doc, getDocs, getDocsFromCache, collection, updateDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet';
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

function PatchNotes() {
	const { user, authLoading } = useContext(AuthContext);
	const [patchNotes, setPatchNotes] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleteModalId, setDeleteModalId] = useState(null);
	const [editingPatchNotes, setEditingPatchNotes] = useState(null);
	const [editedPatchNotes, setEditedPatchNote] = useState(null);

	useEffect(() => {
		const fetchPatchNotes = async () => {
			try {
				const patchSnap = await getDocsFromCache(collection(db, 'patchNotes'));
				let data = [];

				if (!patchSnap.empty) {
					patchSnap.forEach(note => {
						const noteData = note.data();
						noteData.id = note.id;
						data.push(noteData);
					});
				} else {
					const patchSnap = await getDocs(collection(db, 'patchNotes'));

					patchSnap.forEach(note => {
						const noteData = note.data();
						noteData.id = note.id;
						data.push(noteData);
					});
				}

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

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Patch Notes</title>
				<link rel="canonical" href={`https://kspbuilds.com/patch-notes`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="KSP Builds Patch Notes" />

				{loading && <Spinner1 />}

				{!loading && !patchNotes && <CantFind text="No patch notes found" />}
				{!loading && patchNotes && (
					<div className="flex flex-col gap-4 2k:gap-8">
						{patchNotes.map((patchNote, i) => {
							return (
								<div key={i} className="bg-base-600 rounded-xl p-10 2k:p-16">
									<h2 className="font-bold text-2xl 2k:text-4xl text-white">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(patchNote.timestamp.seconds * 1000)}</h2>
									{editingPatchNotes !== patchNote.id && <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(patchNote.patchNote)))} readOnly={true} toolbarHidden={true} />}
									{editingPatchNotes === patchNote.id && <TextEditor text={patchNote.patchNote} setState={setEditedPatchNote} />}

									{!authLoading && user?.siteAdmin && (
										<div className="flex flex-row gap-2 2k:gap-4">
											<Button htmlFor="delete-patch-note-modal" onClick={() => setDeleteModalId(patchNote.id)} text="Delete" icon="delete" />
											{editingPatchNotes !== patchNote.id && <Button text="Edit" icon="edit" onClick={() => setEditingPatchNotes(patchNote.id)} />}
											{editingPatchNotes === patchNote.id && <Button text="Save" color="btn-primary" icon="save" onClick={() => updatePatchNote(patchNote.id)} />}
											{editingPatchNotes === patchNote.id && <Button text="Cancel" color="btn-error" icon="cancel" onClick={() => setEditingPatchNotes(null)} />}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</MiddleContainer>
			{deleteModalId && <DeletePatchNotesModal id={deleteModalId} />}
		</>
	);
}

export default PatchNotes;
