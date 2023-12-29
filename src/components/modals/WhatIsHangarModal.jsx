import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';

function WhatIsHangarModal() {
	return (
		<>
			<input type="checkbox" id="what-is-hangar-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box justify-center relative scrollbar">
					<div className="flex flex-col w-full justify-center">
						<Button htmlFor="what-is-hangar-modal" text="X" position="z-50 absolute right-2 top-2" style="btn-circle" />
						<PlanetHeader text="What is a Hangar?"></PlanetHeader>
						<div className="flex flex-col gap-4 w-full justify-center">
							<div className="p-3 bg-base-200 rounded-lg">
								<p className="text-2xl 2k:text-3xl font-bold text-slate-100 text-center mb-3 2k:mb-6">Hangars</p>
								<p className="text-xl 2k:text-2xl text-slate-200 text-center mb-6 2k:mb-10">Think of a hangar like a youtube playlist. Hangars are where you can save your favorite builds to quickly find later.</p>
								<p className="text-xl 2k:text-2xl text-slate-200 text-center mb-6 2k:mb-10">You can also share your Hangars with anyone, allowing them to see all of the builds you've added to that hangar.</p>
								<p className="text-xl 2k:text-2xl text-slate-200 text-center mb-6 2k:mb-10">
									By default, all of your new uploads will automatically be placed into "Your Builds" hangar, but you can also select as many other Hangars as you want to save that build to.
								</p>
							</div>
							<div className="p-3 bg-base-200 rounded-lg">
								<p className="text-2xl 2k:text-3xl font-bold text-slate-100 text-center mb-3 2k:mb-6">Pinned hangar</p>
								<p className="text-xl 2k:text-2xl text-slate-200 text-center mb-6 2k:mb-10">You can 'Pin' your own hangar to a build.</p>
								<p className="text-xl 2k:text-2xl text-slate-200 mb-6 2k:mb-10">
									• When you pin a hangar to a build, that hangar will appear on the side of that builds page. This is great if you have multiple different craft for one common project/mission.
								</p>
								<p className="text-xl 2k:text-2xl text-slate-200 mb-6 2k:mb-10">• For example, you can have separate builds for a duna lander, one for a probe, and another for the launcher.</p>
								<p className="text-xl 2k:text-2xl text-slate-200 mb-6 2k:mb-10">• By having those builds in the same hangar, users can quickly and easily see other builds they may want to download.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default WhatIsHangarModal;
