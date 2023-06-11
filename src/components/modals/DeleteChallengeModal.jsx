import React from 'react';
import useNews from '../../context/news/NewsActions';
import Button from '../buttons/Button';
import CheckCredentials from '../../components/credentials/CheckCredentials';

function DeleteChallengeModal({ id }) {
	const { deleteChallenge } = useNews();

	return (
		<CheckCredentials type="admin">
			<input type="checkbox" id="delete-challenge-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<Button htmlFor="delete-challenge-modal" style="btn-circle" position="absolute right-2 top-2" text="X" />
					<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete Challenge</h3>
					<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this challenge?</h4>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-challenge-modal" color="btn-success" text="Cancel" icon="cancel" />
						<Button htmlFor="delete-challenge-modal" color="btn-error" onClick={() => deleteChallenge(id)} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</CheckCredentials>
	);
}

export default DeleteChallengeModal;
