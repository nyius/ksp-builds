import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useGetBuildDesc } from '../../../context/build/BuildActions';

/**
 * Displays the builds description
 * @param {*} buildDesc - takes in the builds description
 * @returns
 */
function BuildDescription() {
	const [buildDesc] = useGetBuildDesc(null);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{/* Description */}
			<p className="text-2xl 2k:text-4xl text-slate-400 mb-5">ABOUT THIS BUILD</p>
			<div className="mb-20 2k:mb-32 text-xl 2k:text-3xl text-slate-200">
				<Editor editorState={buildDesc} readOnly={true} toolbarHidden={true} />
			</div>
		</>
	);
}

export default BuildDescription;
