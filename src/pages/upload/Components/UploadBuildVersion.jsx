import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import { useFiltersContext } from '../../../context/filters/FiltersContext';
import Select from '../../../components/selects/Select';

/**
 * Input the field for the builds KSP version
 * @returns
 */
function UploadBuildVersion() {
	const { dispatchBuild, buildToUpload } = useBuildContext();
	const { filtersLoading, kspVersions } = useFiltersContext();

	const handleUploadVersion = e => {
		setBuildToUpload(dispatchBuild, { ...buildToUpload, kspVersion: e.target.id });
	};

	const { SelectBox, Option } = Select(handleUploadVersion, { id: buildToUpload?.kspVersion ? buildToUpload?.kspVersion : 'any', text: buildToUpload?.kspVersion ? buildToUpload?.kspVersion : 'any' });

	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">KSP Version</p>
				<SelectBox size="w-44">
					<Option id="any" displayText={'any'} />
					{!filtersLoading
						? kspVersions.map((version, i) => {
								return <Option key={i} id={version} displayText={`${version} ${i === 0 ? '(Current)' : ''}`} />;
						  })
						: null}
				</SelectBox>
			</div>
		);
	}
}

export default UploadBuildVersion;
