import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import TextEditor from '../../../components/textEditor/TextEditor';
import useCreateDraftJs from '../../../hooks/useCreateDraftJs';
import { useSetUploadBuildDesc } from '../../../context/build/BuildActions';

/**
 * Component for the builds description
 * @returns
 */
function UploadBuildDesc() {
	const { editingBuild } = useBuildContext();
	const [description, setDescription] = useCreateDraftJs(null, editingBuild ? editingBuild.description : `{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`);

	useSetUploadBuildDesc(description);

	return (
		<div className="flex flex-row gap-2 items-center w-full mb-10 2k:mb-20">
			<TextEditor text={description} setState={setDescription} />
		</div>
	);
}

export default UploadBuildDesc;
