import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Button to go to the KSP website to read the original challenge
 * @param {*} url
 * @returns
 */
function ReadOriginalChallengeBtn({ url }) {
	if (url) {
		return <Button type="ahref" href={url} target="_blank" text="Read original article" color="bg-base-900" size="w-fit" icon="right" margin="mb-10 2k:mb-20" />;
	}
}

export default ReadOriginalChallengeBtn;
