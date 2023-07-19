import React from 'react';
import Button from '../../../../components/buttons/Button';
import { setReplyingComment } from '../../../../context/build/BuildActions';
import { useComment } from '../../../../context/build/BuildActions';
import { useBuildContext } from '../../../../context/build/BuildContext';

/**
 * Button to handle clearing a comment
 * @returns
 */
function ClearCommentButton() {
	const { dispatchBuild } = useBuildContext();
	const { setComment } = useComment();

	/**
	 * Handles clearing the comment contents/replying context
	 */
	const handleClearComment = () => {
		setReplyingComment(dispatchBuild, null);
		setComment(null);
	};

	return <Button onClick={handleClearComment} color="bg-base-900" text="Clear" size="w-fit" css="2k:mb-10" icon="cancel" />;
}

export default ClearCommentButton;
