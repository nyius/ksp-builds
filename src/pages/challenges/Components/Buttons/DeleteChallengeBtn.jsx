import React from 'react';
import Button from '../../../../components/buttons/Button';
import CheckCredentials from '../../../../components/credentials/CheckCredentials';

/**
 * Button for displaying the delete challenge modal
 * @returns
 */
function DeleteChallengeBtn() {
	return (
		<CheckCredentials type="admin">
			<Button htmlFor="delete-challenge-modal" text="Delete Challenge" color="bg-base-900" icon="delete" />
		</CheckCredentials>
	);
}

export default DeleteChallengeBtn;
