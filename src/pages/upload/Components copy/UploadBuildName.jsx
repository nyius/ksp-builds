import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';

/**
 * Input the field for the builds name
 * @returns
 */
function UploadBuildName() {
	const { dispatchBuild, buildToUpload } = useBuildContext();

	if (buildToUpload) {
		return (
			<div className="flex flex-row gap-2 items-center">
				<input
					id="name"
					onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, name: e.target.value })}
					type="text"
					placeholder="Build Name"
					defaultValue={buildToUpload.name}
					className="input input-bordered w-96 max-w-lg 2k:input-lg 2k:text-2xl text-slate-200"
					maxLength="50"
				/>
				<p className="text-slate-200 italic 2k:text-2xl ">{50 - buildToUpload.name.length}</p>
			</div>
		);
	}
}

export default UploadBuildName;
