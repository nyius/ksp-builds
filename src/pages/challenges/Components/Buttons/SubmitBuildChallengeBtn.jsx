import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Button for submitting a build to a challenge
 * @param {string} challengeId - the id of the challenge to submit a build to
 * @returns
 */
function SubmitBuildChallengeBtn({ challengeId }) {
	return <Button type="ahref" href={`/upload/challenge=${challengeId}`} text="Submit Build" icon="plus" color="btn-accent" position="z-50" size="w-fit" />;
}

export default SubmitBuildChallengeBtn;
