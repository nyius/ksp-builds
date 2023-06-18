import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the challenges button
 * @returns
 */
function ChallengesBtn() {
	return <Button type="ahref" href="/challenges" css="text-white hidden lg:flex" text="Challenges" icon="mountain" />;
}

export default ChallengesBtn;
