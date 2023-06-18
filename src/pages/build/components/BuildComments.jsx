import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import AuthContext from '../../../context/auth/AuthContext';
import { useComment } from '../../../context/build/BuildActions';
import Spinner1 from '../../../components/spinners/Spinner1';
import Comment from '../../../components/comments/Comment';
import CheckCredentials from '../../../components/credentials/CheckCredentials';
import TextEditor from '../../../components/textEditor/TextEditor';
import UsernameLink from '../../../components/username/UsernameLink';
import draftJsToPlainText from '../../../utilities/draftJsToPlainText';
import AddCommentBtn from './Buttons/AddCommentBtn';
import ClearCommentButton from './Buttons/ClearCommentButton';

/**
 * Component to display a builds comments
 * @returns
 */
function BuildComments() {
	const { commentsLoading, comments, replyingComment } = useContext(BuildContext);
	const { fetchedUserProfile, user } = useContext(AuthContext);
	const { setComment } = useComment();

	if (commentsLoading) {
		return <Spinner1 />;
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<p id="comments" className="text-2xl 2k:text-3xl">
				Comments
			</p>

			{/* Comments */}
			{comments.length === 0 ? (
				<p className="2k:btn-lg 2k:text-2xl mb-20">No comments yet! Be the first to leave one</p>
			) : (
				<div className="flex flex-col gap-4 2k:gap-8 mb-20">
					{comments.map(comment => {
						return <Comment key={comment.id} comment={comment} />;
					})}
				</div>
			)}

			{/* Enter a Comment */}
			<CheckCredentials type="user">
				{!fetchedUserProfile?.blockList?.includes(user.uid) ? (
					<>
						{/* Show quoted comment being replied to */}
						{replyingComment ? (
							<div className="flex flex-row items-center gap-4 2k:gap-8 bg-base-800 w-full rounded-t-lg p-3 2k:p-6">
								<div className="italic text-slate-400 text-xl 2k:text-2xl shrink-0">Replying To</div>
								<UsernameLink username={replyingComment.username} uid={replyingComment.uid} />
								<p className="single-line-truncate text-xl 2k-text-2xl italic">"{draftJsToPlainText(replyingComment.comment)}"</p>
							</div>
						) : null}

						<TextEditor setState={setComment} />

						<div id="add-comment" className="flex flex-row gap-3 2k:gap-6">
							<AddCommentBtn />
							<ClearCommentButton />
						</div>
					</>
				) : null}
			</CheckCredentials>
		</>
	);
}

export default BuildComments;
