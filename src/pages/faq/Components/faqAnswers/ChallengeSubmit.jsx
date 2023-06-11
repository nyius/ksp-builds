import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Submit a build for a challenge FAQ Card
 * @returns
 */
function ChallengeSubmit() {
	const navigate = useNavigate();
	return (
		<>
			<p className="!text-start p-3">Submitting a build for a challenge can be done in a few ways.</p>
			<ul className="steps steps-vertical !auto-rows-min">
				<li className="step step-primary !text-start p-3">The first way is by navigating to the 'Uplaod' page. Once there, under the 'Weekly Challenge' dropdown, you can select which challenge your build is for.</li>
				<li className="step step-primary !text-start p-3">
					<p>
						Another way is by navigation to our "Challenges" page{' '}
						<span className="link link-accent" onClick={() => navigate('/challenges')}>
							here
						</span>
						, finding a challenge you like, and then clicking the 'Submit Build' button at the bottom of that challenges page.{' '}
					</p>
				</li>
				<li className="step step-primary !text-start p-3">
					Lastly, you can submit a build to a challenge on the home page. At the top of the homepage where the weekly challenges appear, find the one you like and simply press the 'submit build' button.
				</li>
			</ul>
		</>
	);
}

export default ChallengeSubmit;
