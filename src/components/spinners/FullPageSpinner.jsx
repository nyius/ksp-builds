import React from 'react';
import Spinner2 from './Spinner2';

/**
 * A full page loading spinner
 * @returns
 */
function FullPageSpinner() {
	return (
		<div className="w-full h-full bg-base-600 flex flex-col items-center justify-center">
			<Spinner2 />
		</div>
	);
}

export default FullPageSpinner;
