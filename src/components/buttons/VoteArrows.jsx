import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';

function VoteArrows({ build }) {
	const { handleVoting } = useAuth();
	const { user } = useContext(AuthContext);

	/**
	 * Checks if the current user has voted on the build. Takes in a vote type to check and the id of the build. Returns the tailwind syntax to color the vote arrow
	 * @param {*} type
	 * @param {*} buildId
	 * @returns
	 */
	const checkIfVoted = (type, buildId) => {
		if (user.upVotes) {
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

	return (
		<div className="flex flex-row gap-8">
			<div className="flex flex-row gap-2 cursor-pointer items-end">
				<span id="upVote" onClick={() => handleVoting('upVote', build)} className={`text-4xl hover:text-orange-600 ${checkIfVoted('upVote', build.id)}`}>
					<GoArrowUp id="upVote" />
				</span>
				<span className="text-lg">{build.upVotes}</span>
			</div>
			<div className="flex flex-row gap-2 text-2xl cursor-pointer items-end">
				<span id="downVote" onClick={() => handleVoting('downVote', build)} className={`text-4xl hover:text-sky-500 ${checkIfVoted('downVote', build.id)}`}>
					<GoArrowDown id="downVote" />
				</span>
				<span className="text-lg">{build.downVotes}</span>
			</div>
		</div>
	);
}

export default VoteArrows;
