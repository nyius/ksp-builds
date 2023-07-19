import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import youtubeLinkConverter from '../../../utilities/youtubeLinkConverter';

/**
 * Component for displaying a builds video
 * @returns
 */
function BuildVideo() {
	const { loadedBuild } = useBuildContext();
	return (
		<>
			{loadedBuild.video ? (
				<div className="mb-6">
					<iframe src={youtubeLinkConverter(loadedBuild.video)}></iframe>
				</div>
			) : null}
		</>
	);
}

export default BuildVideo;
