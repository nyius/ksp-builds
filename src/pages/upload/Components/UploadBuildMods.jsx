import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';

/**
 * Input the field for the builds mods
 * @returns
 */
function UploadBuildMods() {
	const { dispatchBuild, buildToUpload } = useBuildContext();

	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">Uses Mods</p>
				<input onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, modsUsed: e.target.checked })} defaultChecked={buildToUpload && buildToUpload.modsUsed} type="checkbox" className="checkbox checkbox-accent 2k:checkbox-lg" />
			</div>
		);
	}
}

export default UploadBuildMods;
