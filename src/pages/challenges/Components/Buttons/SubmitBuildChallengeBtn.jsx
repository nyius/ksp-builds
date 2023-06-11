import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Button for submitting a build to a challenge
 * @param {string} challengeId - the id of the challenge to submit a build to
 * @returns
 */
function SubmitBuildChallengeBtn({ challengeId }) {
	return <Button type="ahref" href={`/upload/c=${challengeId}`} text="Submit Build" icon="plus" color="btn-accent" position="z-50" size="w-fit" margin="mt-10 2k:mt-20" />;
}

export default SubmitBuildChallengeBtn;
