import React from 'react';
import draftJsToPlainText from '../../../../utilities/draftJsToPlainText';

/**
 * Displays a builds description
 * @param {*} description
 * @returns
 */
function BuildCardDesc({ description }) {
	return <h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg multi-line-truncate mb-4 2k:mb-8 w-full">{draftJsToPlainText(description)}</h3>;
}

export default BuildCardDesc;
