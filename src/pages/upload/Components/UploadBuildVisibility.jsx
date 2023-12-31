import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import Select from '../../../components/selects/Select';

/**
 * Input the field for the builds visibility
 * @returns
 */
function UploadBuildVisibility() {
	const { dispatchBuild, buildToUpload } = useBuildContext();

	const handleSetVisibility = e => {
		setBuildToUpload(dispatchBuild, { ...buildToUpload, visibility: e.target.id });
	};

	const { SelectBox, Option } = Select(handleSetVisibility, { id: buildToUpload?.visibility ? buildToUpload?.visibility : 'Public', text: buildToUpload?.visibility ? buildToUpload?.visibility : 'Public' });

	const options = ['Public', 'Private', 'Unlisted'];

	if (buildToUpload) {
		return (
			<div className="flex flex-row items-center gap-6 text-slate-200">
				<p className="2k:text-2xl">Visibility</p>
				<SelectBox size="w-44">
					{options.map((visibility, i) => {
						return <Option key={i} id={visibility} displayText={visibility} />;
					})}
				</SelectBox>
			</div>
		);
	}
}

export default UploadBuildVisibility;
