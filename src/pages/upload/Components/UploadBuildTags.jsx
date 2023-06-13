import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';

/**
 * Input the field for the builds tags
 * @returns
 */
function UploadBuildTags() {
	const { dispatchBuild, buildToUpload } = useContext(BuildContext);

	/**
	 * Handles setting the tags
	 * @param {*} e
	 */
	const setTags = e => {
		// If the user hits space, add the tag
		if (e.target.value[e.target.value.length - 1] === ',') {
			const newTag = e.target.value;

			setBuildToUpload(dispatchBuild, { ...buildToUpload, tags: [...buildToUpload.tags, newTag.slice(0, newTag.length - 1).trim()] });

			const tagField = document.getElementById('tagsField');
			tagField.value = '';
		}
	};

	/**
	 * handles removing a tag
	 * @param {*} e
	 */
	const removeTag = e => {
		const newTags = buildToUpload.tags.splice(e.target.id, 1);
		setBuildToUpload(dispatchBuild, { ...buildToUpload, tags: [...buildToUpload.tags] });
	};

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<>
				<div className="flex flex-col gap-2 2k:gap-4">
					<div className="flex flex-row gap-4 items-center mb-2 2k:mb-4 mt-8 2k:mt-18">
						<h3 className="text-slate-200 text-xl 2k:text-3xl">Tags (3 max)</h3>
						<h4 className="text-slate-400 text-lg italic 2k:text-2xl">Press ',' to add a new tag</h4>
					</div>
					<input id="tagsField" disabled={buildToUpload.tags.length === 3} onChange={setTags} type="text" placeholder="Tags" className="input 2k:input-lg 2k:text-2xl 2k:mb-6 input-bordered w-96 max-w-lg text-slate-200" maxLength="30" />
				</div>

				<div className="flex flex-row gap-10 2k:mb-10">
					{buildToUpload.tags.map((tag, i) => {
						return (
							<div className="indicator" key={i}>
								<span onClick={removeTag} id={i} className="indicator-item 2k:text-2xl badge badge-error cursor-pointer">
									x
								</span>
								<div className="badge badge-lg 2k:text-2xl 2k:p-4 badge-info">{tag}</div>
							</div>
						);
					})}
				</div>
			</>
		);
	}
}

export default UploadBuildTags;
