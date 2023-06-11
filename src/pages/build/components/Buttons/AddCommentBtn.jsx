import React from 'react';
import Button from '../../../../components/buttons/Button';
import { useComment } from '../../../../context/build/BuildActions';

/**
 * Button for adding a comment to a build
 * @returns
 */
function AddCommentBtn() {
	const { addComment } = useComment();

	return <Button onClick={addComment} color="btn-primary" text="Save" size="w-fit" css="2k:mb-10" icon="comment" />;
}

export default AddCommentBtn;
