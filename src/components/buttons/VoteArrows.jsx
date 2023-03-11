import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';

/**
 * Shows the arrows to upvote/downvote. Takes in the build
 * @param {*} build
 * @returns
 */
function VoteArrows({ build }) {
	const { handleVoting } = useAuth();
	const { user, authLoading } = useContext(AuthContext);

	/**
	 * Checks if the current user has voted on the build. Takes in a vote type to check and the id of the build. Returns the tailwind syntax to color the vote arrow
	 * @param {*} type
	 * @param {*} buildId
	 * @returns
	 */
	const checkIfVoted = (type, buildId) => {
		if (!authLoading && user?.upVotes) {
			if (type === `upVote`) {
				if (user?.upVotes.includes(buildId)) {
					return 'text-orange-600';
				}
			}
			if (type === `downVote`) {
				if (user?.downVotes.includes(buildId)) return 'text-sky-500';
			}
		}
	};

	/**
	 * Returns the total build vote score
	 * @returns
	 */
	const calculateVoteCount = () => {
		if (build.upVotes - build.downVotes < 0) {
			return 0;
		} else {
			return build.upVotes - build.downVotes;
		}
	};

	return (
		<div className="flex flex-row gap-5 items-center">
			<span className="text-lg 2k:text-2xl">{calculateVoteCount()}</span>
			<span id="upVote" onClick={() => handleVoting('upVote', build)} className={`vote-arrow cursor-pointer hover:text-orange-600 ${checkIfVoted('upVote', build.id)}`}>
				<GoArrowUp id="upVote" />
			</span>
			{!authLoading && user?.username && (
				<span id="downVote" onClick={() => handleVoting('downVote', build)} className={`vote-arrow cursor-pointer hover:text-sky-500 ${checkIfVoted('downVote', build.id)}`}>
					<GoArrowDown id="downVote" />
				</span>
			)}
		</div>
	);
}

export default VoteArrows;
