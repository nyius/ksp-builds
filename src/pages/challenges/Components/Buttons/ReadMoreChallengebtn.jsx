import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Read more button for a challenge card
 * @param {string} challengeId - the id of the challenge to link to
 * @returns
 */
function ReadMoreChallengebtn({ challengeId }) {
	return <Button type="ahref" href={`/challenges/${challengeId}`} text="Read more" color="bg-base-900 hover:!bg-primary text-white" css="font-thin absolute bottom-2 right-2" position="z-50" size="w-fit" />;
}

export default ReadMoreChallengebtn;
