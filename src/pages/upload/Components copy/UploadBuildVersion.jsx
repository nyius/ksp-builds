import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import { useFiltersContext } from '../../../context/filters/FiltersContext';

/**
 * Input the field for the builds KSP version
 * @returns
 */
function UploadBuildVersion() {
	const { dispatchBuild, buildToUpload } = useBuildContext();
	const { filtersLoading, kspVersions } = useFiltersContext();

	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">KSP Version</p>
				<select defaultValue={buildToUpload.kspVersion} id="kspVersion" onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, kspVersion: e.target.value })} className="select select-bordered 2k:select-lg 2k:text-2xl max-w-xs">
					<option value="any">Any</option>
					{!filtersLoading
						? kspVersions.map((version, i) => {
								return (
									<option key={i} value={version}>
										{version} {i === 0 ? '(Current)' : null}
									</option>
								);
						  })
						: null}
				</select>
			</div>
		);
	}
}

export default UploadBuildVersion;
