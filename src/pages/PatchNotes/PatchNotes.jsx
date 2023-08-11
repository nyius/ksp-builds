import React, { useState } from 'react';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Spinner2 from '../../components/spinners/Spinner2';
import CantFind from '../../components/cantFind/CantFind';
import DeletePatchNotesModal from '../../components/modals/DeletePatchNoteModal';
import Helmet from '../../components/Helmet/Helmet';
import DeletePatchNoteBtn from './Components/Buttons/DeletePatchNoteBtn';
import CheckCredentials from '../../components/credentials/CheckCredentials';
import EditPatchNoteBtn from './Components/Buttons/EditPatchNoteBtn';
import SavePatchEditBtn from './Components/Buttons/SavePatchEditBtn';
import CancelEditPatchBtn from './Components/Buttons/CancelEditPatchBtn';
import PatchNoteEditor from './Components/PatchNoteEditor';
import PatchNote from './Components/PatchNote';
import { useFetchPatchNotes } from '../../context/news/NewsActions';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';

/**
 * KSP Builds Patch notes Page
 * @returns
 */
function PatchNotes() {
	const [patchNotes, loading] = useFetchPatchNotes(null);
	const [editedPatchNotes, setEditedPatchNote] = useState(null);

	//---------------------------------------------------------------------------------------------------//
	if (loading) {
		return (
			<MiddleContainer>
				<Spinner2 />
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

	return (
		<>
			<Helmet title="Patch Notes" pageLink="https://kspbuilds.com/patch-notes" type="article" description="See the latest updates and fixes to the KSP Builds website." />

			<MiddleContainer>
				<PlanetHeader text="KSP Builds Patch Notes" />

				<div className="flex flex-col gap-4 2k:gap-8">
					{patchNotes.map((patchNote, i) => {
						return (
							<div key={i} className="bg-base-600 rounded-xl p-10 2k:p-16">
								<h2 className="font-bold text-2xl 2k:text-4xl text-white">Update - {createDateFromFirebaseTimestamp(patchNote.timestamp.seconds)}</h2>
								<PatchNote patchNote={patchNote} />
								<PatchNoteEditor patchNote={patchNote} setEditedPatchNote={setEditedPatchNote} />

								<CheckCredentials type="admin">
									<div className="flex flex-row gap-2 2k:gap-4">
										<DeletePatchNoteBtn id={patchNote.id} />
										<EditPatchNoteBtn id={patchNote.id} />
										<SavePatchEditBtn id={patchNote.id} editedPatchNotes={editedPatchNotes} />
										<CancelEditPatchBtn id={patchNote.id} />
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
