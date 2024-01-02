import React from 'react';
import Button from '../../../../components/buttons/Button';
import CheckCredentials from '../../../../components/credentials/CheckCredentials';

/**
 * Button for displaying the delete challenge modal
 * @returns
 */
function DeleteArticleBtn() {
	return (
		<CheckCredentials type="admin">
			<Button htmlFor="delete-article-modal" text="Delete Article" color="bg-base-900" icon="delete" />
		</CheckCredentials>
	);
}

export default DeleteArticleBtn;
