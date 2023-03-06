import React from 'react';
import youtubeLinkConverter from '../../utilities/youtubeLinkConverter';

function VideoModal({ video }) {
	return (
		<>
			<input type="checkbox" id="video-modal" className="modal-toggle" />
			<div className="modal w-3/4">
				<div className="modal-box relative scrollbar">
					<label htmlFor="video-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
						✕
					</label>
					<iframe src={youtubeLinkConverter(video)}></iframe>
				</div>
			</div>
		</>
	);
}

export default VideoModal;
