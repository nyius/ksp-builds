import React, { useContext, useEffect, useState } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';
import TextEditor from '../../../components/textEditor/TextEditor';

/**
 * Component for the builds description
 * @returns
 */
function UploadBuildDesc() {
	const { dispatchBuild, buildToUpload, editingBuild } = useContext(BuildContext);
	const [description, setDescription] = useState(editingBuild ? editingBuild.description : `{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`);

	useEffect(() => {
		if (description) {
			setBuildToUpload(dispatchBuild, { ...buildToUpload, description: description });
		}
	}, [description]);

	return (
		<div className="flex flex-row gap-2 items-center w-full mb-10 2k:mb-20">
			<TextEditor text={description} setState={setDescription} />
		</div>
	);
}

export default UploadBuildDesc;
