import React, { useContext, useState, useEffect } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import BuildTypes from '../../../components/create/BuildTypes';

/**
 * Input the field for the builds video
 * @returns
 */
function UploadBuildTypes() {
	const { dispatchBuild, buildToUpload } = useContext(BuildContext);
	const [types, setTypes] = useState({ type: buildToUpload.type.length > 0 ? buildToUpload.type : [] });

	useEffect(() => {
		setBuildToUpload(dispatchBuild, { ...buildToUpload, type: types.type });
	}, [types]);

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<>
				<h3 className="text-slate-200 text-xl 2k:text-3xl mb-2 2k:mb-4">Build Type (3 max)</h3>
				<BuildTypes typesArr={buildToUpload.type} setBuildState={setTypes} />
			</>
		);
	}
}

export default UploadBuildTypes;
