import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * How to Upload a build FAQ
 * @returns
 */
function HowToUpload() {
	return (
		<>
			{/* How to upload a build */}
			<p className="!text-start p-3">Uploading a build is actually very simple!</p>
			<ul className="steps steps-vertical !auto-rows-min">
				<li className="step step-primary !text-start p-3">First you'll want to click the 'upload' button on the navbar</li>
				<li className="step step-primary !text-start p-3">
					Next, fill out all of the required information such as a build name, types, descrtiption, etc. If your build uses mods, you'll want to check the 'Uses Mods' checkbox and list any of the mods used in your builds description.
				</li>
				<li className="step step-primary !text-start p-3">
					Then you'll want to hop into KSP2 and grab some beauty shots of your build! You'll want your first image to accurately show off your craft so that everyone browsing builds can quickly and easily see what your craft looks like.
					Once you've grabbed some good pictures, upload them to your build. You can also include a youtube video to your build if you have one!
				</li>
				<li className="step step-primary !text-start p-3">
					<div className="flex flex-col gap-4 w-full items-center justify-center">
						<div>
							Next you'll want to get your build and paste it into the 'Paste build here' text area. To do this is actually very easy! Inside KSP2, open the VAB (Vehicle Assembly Building) and open up your craft. Select the whole ship
							(usually by selecting the command module) and while selected, press{' '}
							<span>
								<kbd className="kbd">ctrl</kbd>+<kbd className="kbd">c</kbd>
							</span>{' '}
							and it will copy the ships JSON text to your clipboard. Now just come bak to KSPbuilds and use{' '}
							<span>
								<kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
							</span>{' '}
							to paste it into the text area. Click the button below for a brief tutorial
						</div>
						<Button text="How?" icon="info" htmlFor="how-to-copy-build-modal" color="bg-base-900" />
					</div>
				</li>
			</ul>
		</>
	);
}

export default HowToUpload;
