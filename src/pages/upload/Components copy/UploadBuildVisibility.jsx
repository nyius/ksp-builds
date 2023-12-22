import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';

/**
 * Input the field for the builds visibility
 * @returns
 */
function UploadBuildVisibility() {
	const { dispatchBuild, buildToUpload } = useBuildContext();
	const options = ['Public', 'Private', 'Unlisted'];

	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">Visibility</p>
				<select id="visibility" defaultValue={buildToUpload.visibility} onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, visibility: e.target.value })} className="select select-bordered 2k:select-lg 2k:text-2xl max-w-xs">
					{options.map((visibility, i) => {
						return (
							<option key={i} value={visibility}>
								{visibility}
							</option>
						);
					})}
				</select>
			</div>
		);
	}
}

export default UploadBuildVisibility;
