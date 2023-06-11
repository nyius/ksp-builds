import React from 'react';

/**
 * How to Import FAQ Card
 * @returns
 */
function HowToDelete() {
	return (
		<>
			<p className="!text-start p-3">Deleting your uploaded build can be done quickly in just a few steps.</p>
			<ul className="steps steps-vertical !auto-rows-min">
				<li className="step step-primary !text-start p-3">First you'll want to navigate to the build you want to delete.</li>
				<li className="step step-primary !text-start p-3">Then, click the delete button (a red button with a garbage can icon) under the builds description. Then you'll be prompted to confirm that you want to delete the build.</li>
			</ul>
		</>
	);
}

export default HowToDelete;
