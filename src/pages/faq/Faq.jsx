import React from 'react';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';

function Faq() {
	return (
		<MiddleContainer>
			<PlanetHeader text="F.A.Q" />
			<div className="text-xl 2k:text-3xl mb-6 2k:mb-12">Here you'll find some answers to commonly answered questions</div>
			{/* How to upload a build */}
			<div tabIndex={0} className="collapse border border-base-300 bg-base-100 rounded-box">
				<div className="collapse-title text-xl 2k:text-3xl font-bold">How do I upload a build?</div>
				<div className="collapse-content text-3xl">
					<p className="!text-start p-3">Uploading a build is actually very simple!</p>
					<ul className="steps steps-vertical !auto-rows-min">
						<li className="step step-primary !text-start p-3">First you'll want to click the 'upload' button on the navbar</li>
						<li className="step step-primary !text-start p-3">
							Next, fill out all of the required information such as a build name, types, descrtiption, etc. If your build uses mods, you'll want to check the 'Uses Mods' checkbox and list any of the mods used in your builds
							description.
						</li>
						<li className="step step-primary !text-start p-3">
							Then you'll want to hop into KSP2 and grab some beauty shots of your build! You'll want your first image to accurately show off your craft so that everyone browsing builds can quickly and easily see what your craft looks
							like. Once you've grabbed some good pictures, upload them to your build.
						</li>
						<li className="step step-primary !text-start p-3">
							<div className="flex flex-col gap-4 w-full items-center justify-center">
								<div>
									Next you'll want to get your build and paste it into the 'Paste build here' text area. To do this is actually very easy! Inside KSP2, open the VAB (Vehicle Assembly Building) and open up your craft. Select the
									whole ship (usually by selecting the command module) and while selected, press{' '}
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
				</div>
			</div>

			{/* How to get a build into KSP2 */}
			<div tabIndex={1} className="collapse border border-base-300 bg-base-100 rounded-box">
				<div className="collapse-title text-xl 2k:text-3xl font-bold">How do I get a build into KSP2?</div>
				<div className="collapse-content text-3xl">
					<p className="!text-start p-3">Getting a build from the website into KSP2 couldn't be easier!</p>
					<ul className="steps steps-vertical !auto-rows-min">
						<li className="step step-primary !text-start p-3">First you'll want to find a build you want to try out</li>
						<li className="step step-primary !text-start p-3">Then, click the "Export to KSP2" Button and it will copy the whole craft JSON text to your clipboard</li>
						<li className="step step-primary !text-start p-3">
							<div className="flex flex-col gap-5 items-center">
								<div>
									Next, open up KSP2 and load into the VAB(Vehicle Assembly Building). Once you're in, simply press{' '}
									<span>
										<kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
									</span>{' '}
									and you'll have the craft!
								</div>
								<Button text="How to import into KSP2" color="bg-base-900" htmlFor="how-to-paste-build-modal" size="w-fit" icon="info" />
							</div>
						</li>
					</ul>
				</div>
			</div>

			{/* Private Builds */}
			<div tabIndex={2} className="collapse border border-base-300 bg-base-100 rounded-box">
				<div className="collapse-title text-xl 2k:text-3xl font-bold">Can I make a private upload?</div>
				<div className="collapse-content text-3xl">
					<p className="!text-start p-3">
						Yes! When uploading a craft, you have the option to choose from "Public", where everyone can see your craft, "Private", where only you can see the craft, and "Unlisted", where it won't appear in any searches but anybody with
						the link can see your craft.
					</p>
				</div>
			</div>
		</MiddleContainer>
	);
}

export default Faq;
