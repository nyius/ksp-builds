import React from 'react';
import Button from '../../../../components/buttons/Button';
import HowToImportBtn from '../Buttons/HowToImportBtn';

/**
 * How to Import FAQ Card
 * @returns
 */
function HowToImport() {
	return (
		<>
			<p className="!text-start p-3">Getting a build from the website into KSP2 couldn't be easier!</p>
			<ul className="steps steps-vertical !auto-rows-min">
				<li className="step step-primary !text-start p-3">First you'll want to find a build you want to try out. You can do that by going to the home page and looking for a build that you like!</li>
				<li className="step step-primary !text-start p-3">
					Then, you can either hover over the builds card and clicking the 'Export to KSP' button, or click the builds card to go to its page and then click the "Export to KSP2" Button there.
					<br />
					This will copy the whole craft JSON text to your clipboard, no files needed!
				</li>
				<li className="step step-primary !text-start p-3">
					<div className="flex flex-col gap-5 items-center">
						<div>
							Next, open up KSP2 and load into the VAB(Vehicle Assembly Building). Once you're in, simply press{' '}
							<span>
								<kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
							</span>{' '}
							and you'll have the craft!
						</div>
						<HowToImportBtn />
					</div>
				</li>
			</ul>
		</>
	);
}

export default HowToImport;
