import React from 'react';
import Button from '../../buttons/Button';

/**
 * Delete conversation button
 * @returns
 */
function DeleteConvoBtn() {
	return <Button htmlFor="delete-conversation-modal" text="x" style="btn-circle" position="absolute top-1 right-1" size="!btn-sm" />;
}

export default DeleteConvoBtn;
