import React from 'react';
import Button from '../buttons/Button';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase.config';
import errorReport from '../../utilities/errorReport';

/**
 * Modal for deleting a accolade
 * @returns
 */
function DeleteAccoladeModal({ accoladeId, setDeleteSuccess }) {
	/**
	 * handles deleting a post
	 */
	const deleteAccolade = async () => {
		try {
			await deleteDoc(doc(db, 'accolades', accoladeId));
			setDeleteSuccess(true);

			toast.success('Accolade deleted');
		} catch (error) {
			errorReport(error, false, 'deleteAccolade');
			toast.error('Something went wrong deleting post');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (accoladeId) {
		return (
			<>
				<input type="checkbox" id="delete-accolade-modal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button htmlFor="delete-accolade-modal" style="btn-circle" position="absolute right-2 top-2" text="X" />
						<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete accolade</h3>
						<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this accolade?</h4>
						<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
							<Button htmlFor="delete-accolade-modal" color="btn-success" text="Cancel" icon="cancel" />
							<Button htmlFor="delete-accolade-modal" color="btn-error" onClick={deleteAccolade} text="Delete" icon="delete" />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default DeleteAccoladeModal;
