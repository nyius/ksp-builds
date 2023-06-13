import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../context/build/BuildActions';

/**
 * Input the field for the builds video
 * @returns
 */
function UploadBuildVideo() {
	const { dispatchBuild, buildToUpload } = useContext(BuildContext);

	if (buildToUpload) {
		return (
			<div className="flex flex-row gap-2 items-center mb-10 2k:mb-20">
				<input
					id="video"
					onChange={e => setBuildToUpload(dispatchBuild, { ...buildToUpload, video: e.target.value })}
					type="text"
					defaultValue={buildToUpload.video}
					placeholder="Youtube video ID (optional)"
					className="input 2k:input-lg input-bordered w-96 max-w-lg mb-6 2k:text-2xl text-slate-200"
				/>
				<p className="italic text-slate-400 2k:text-2xl">Eg. dQw4w9WgXcQ, this comes after "youtube.com'watch?v=" in the URL </p>
			</div>
		);
	}
}

export default UploadBuildVideo;
