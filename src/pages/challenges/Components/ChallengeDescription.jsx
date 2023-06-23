import React from 'react';
import Parser from 'html-react-parser';

/**
 * Displays a challenges description
 * @param {*} challenge - the raw challenge
 * @returns
 */
function ChallengeDescription({ challenge }) {
	let doc = new DOMParser().parseFromString(challenge.content, 'text/html');

	const htmlDecode = input => {
		let e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes.length === 0 ? '' : e.childNodes[3].nodeValue;
	};

	return <div className="challengeDesc">{Parser(challenge.content)}</div>;
}

export default ChallengeDescription;
