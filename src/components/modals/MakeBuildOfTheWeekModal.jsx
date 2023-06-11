import React, { useContext, useState } from 'react';
import BuildContext from '../../context/build/BuildContext';
import { setBuildOfTheWeek, useMakeBuildOfTheWeek } from '../../context/build/BuildActions';
import Button from '../buttons/Button';
import TextEditor from '../textEditor/TextEditor';
import CheckCredentials from '../credentials/CheckCredentials';

/**
 * Modal to make a build the build of the week
 * @returns
 */
function MakeBuildOfTheWeekModal() {
	const { makeBuildOfTheWeek } = useMakeBuildOfTheWeek();
	const [notification, setNotification] = useState('');
	const { dispatchBuild, buildOfTheWeek, loadedBuild } = useContext(BuildContext);

	//---------------------------------------------------------------------------------------------------//
	return (
		<CheckCredentials type="admin">
			{loadedBuild ? (
				<>
					<input type="checkbox" id="build-of-the-week-modal" className="modal-toggle" />
					<div className="modal">
						<div className="modal-box relative !max-w-1/2">
							<Button htmlFor="build-of-the-week-modal" style="btn-circle" position="absolute right-2 top-2" text="X" onClick={() => setBuildOfTheWeek(dispatchBuild, null)} />
							<h3 className="text-xl 2k:text-3xl font-bold text-white text-center 2k:mb-6">Make Build of the Week</h3>
							<h4 className="text-xl 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to make this build of the week?</h4>
							{buildOfTheWeek && <TextEditor setState={setNotification} />}
							<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
								<Button htmlFor="build-of-the-week-modal" color="btn-success" onClick={() => makeBuildOfTheWeek(notification)} text="Yes" icon="fill-star" />
								<Button htmlFor="build-of-the-week-modal" color="btn-error" text="Cancel" icon="cancel" onClick={() => setBuildOfTheWeek(dispatchBuild, null)} />
							</div>
						</div>
					</div>
				</>
			) : null}
		</CheckCredentials>
	);
}

export default MakeBuildOfTheWeekModal;
