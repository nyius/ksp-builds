import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import youtubeLinkConverter from '../../../utilities/youtubeLinkConverter';

/**
 * Component for displaying a builds video
 * @returns
 */
function BuildVideo() {
	const { loadedBuild } = useContext(BuildContext);
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
