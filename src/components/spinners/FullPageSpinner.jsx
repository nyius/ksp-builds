import React from 'react';
import Spinner1 from './Spinner1';

/**
 * A full page loading spinner
 * @returns
 */
function FullPageSpinner() {
	return (
		<div className="w-full h-full bg-base-600 flex flex-col items-center justify-center">
			<Spinner1 />
		</div>
	);
}

export default FullPageSpinner;
