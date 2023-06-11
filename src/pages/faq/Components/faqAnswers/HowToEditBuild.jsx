import React from 'react';

/**
 * How to Import FAQ Card
 * @returns
 */
function HowToEditBuild() {
	return (
		<>
			<p className="!text-start p-3">Editing a build you uploaded can be done in a few simple steps.</p>
			<ul className="steps steps-vertical !auto-rows-min">
				<li className="step step-primary !text-start p-3">First you'll want to navigate to the build you want to edit.</li>
				<li className="step step-primary !text-start p-3">Then, click the edit button (a blue button with a pencil icon) under the builds description.</li>
				<li className="step step-primary !text-start p-3">This will take you to the edit page where you can edit any information you want about your build.</li>
				<li className="step step-primary !text-start p-3">Once you've made your changes, click the "Save" button and your build will be updated.</li>
			</ul>
		</>
	);
}

export default HowToEditBuild;
