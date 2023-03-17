import React from 'react';

function Alerts({ text, color }) {
	return (
		<div className="alert alert-info shadow-lg">
			<div>
				<span>{text}.</span>
			</div>
		</div>
	);
}

export default Alerts;
