import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useHandleVoting } from '../../context/auth/AuthActions';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';
import CheckCredentials from '../credentials/CheckCredentials';

/**
 * Shows the arrows to upvote/downvote. Takes in the build
 * @param {obj} build - the builds obkect
 * @param {string} view - (optional) 'stacked' if you want the up arrow on top, then vote count, then bottom arrow on bottom (like reddit)
 * @returns
 */
function VoteArrows({ build, view }) {
	const { handleVoting } = useHandleVoting();
	const { user, authLoading } = useAuthContext();

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
			let votes = `${build.upVotes - build.downVotes}`;
			if (votes > 9999) {
				votes = votes.slice(0, 2) + '.' + votes.slice(2, 3) + 'k';
			}

			return votes;
		}
	};

	return (
		<div className={`flex ${view === 'stacked' ? 'flex-col' : 'flex-row'} gap-1 items-center`}>
			<span className="text-lg 2k:text-2xl">{calculateVoteCount()}</span>
			<span id="upVote" onClick={() => handleVoting('upVote', build)} className={`vote-arrow cursor-pointer hover:text-orange-600 ${checkIfVoted('upVote', build.id)}`}>
				<GoArrowUp id="upVote" />
			</span>
			<CheckCredentials type="user">
				<span id="downVote" onClick={() => handleVoting('downVote', build)} className={`vote-arrow cursor-pointer hover:text-sky-500 ${checkIfVoted('downVote', build.id)}`}>
					<GoArrowDown id="downVote" />
				</span>
			</CheckCredentials>
		</div>
	);
}

export default VoteArrows;
