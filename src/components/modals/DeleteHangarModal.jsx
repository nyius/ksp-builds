import React from 'react';
import Button from '../buttons/Button';
import { useHangarContext } from '../../context/hangars/HangarContext';
import { setDeleteHangar, useDeleteHangar } from '../../context/hangars/HangarActions';
import PlanetHeader from '../header/PlanetHeader';

function DeleteHangarModal() {
	const { dispatchHangars, deleteHangarId, deleteHangarName } = useHangarContext();
	const { deleteHangar } = useDeleteHangar();

	const handleChange = () => {
		return;
	};

	return (
		<>
			<input type="checkbox" checked={deleteHangarId ? true : false} onChange={handleChange} id="delete-hangar-modal" className="modal-toggle" />
			<div className="modal z-1000">
				<div className="modal-box relative">
					<Button htmlFor="delete-hangar-modal" style="btn-circle" position="z-50 absolute right-2 top-2" text="X" onClick={() => setDeleteHangar(dispatchHangars, null, null)} />
					<PlanetHeader text="Delete Hangar"></PlanetHeader>
					<p className="text-xl 2k:text-3xl text-center mb-10 2k:mb-16 text-slate-100">Are you sure you want to delete the hangar '{deleteHangarName}'?</p>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-hangar-modal" color="btn-success" text="Cancel" icon="cancel" onClick={() => setDeleteHangar(dispatchHangars, null, null)} />
						<Button htmlFor="delete-hangar-modal" color="btn-error" onClick={() => deleteHangar()} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteHangarModal;
